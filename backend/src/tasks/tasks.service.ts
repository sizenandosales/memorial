import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpirationCheck() {
    this.logger.log(
      'Iniciando verificação diária de expiração de memoriais...',
    );

    const today = new Date();
    const limitDate = new Date();
    limitDate.setDate(today.getDate() + 3);

    // Busca apenas memoriais que expiram nos próximos 3 dias
    const expiringMemorials = await this.prisma.memorial.findMany({
      where: {
        expiresAt: {
          gte: today,
          lte: limitDate,
        },
      },
      include: { user: true },
    });

    if (expiringMemorials.length === 0) {
      this.logger.log('Nenhum memorial expirando nos próximos 3 dias.');
      return;
    }

    this.logger.log(
      `Encontrados ${expiringMemorials.length} memoriais para notificar.`,
    );

    for (const memorial of expiringMemorials) {
      const userEmail = memorial.user?.email;

      if (userEmail) {
        try {
          await this.mailService.sendExpirationWarning(
            userEmail,
            memorial.fullName,
          );
          this.logger.log(`Aviso de expiração enviado para: ${userEmail}`);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Erro desconhecido';
          this.logger.error(
            `Falha ao enviar e-mail para ${userEmail}: ${message}`,
          );
        }
      } else {
        this.logger.warn(
          `Memorial ${memorial.fullName} (ID: ${memorial.id}) não possui e-mail de usuário associado.`,
        );
      }
    }

    this.logger.log('Verificação de expiração concluída com sucesso.');
  }
}
