import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  // Funcionalidade existente
  async sendExpirationWarning(email: string, memorialName: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Aviso de Expiração de Memorial',
      text: `Olá, o memorial ${memorialName} está prestes a expirar em 3 dias. Por favor, verifique sua conta.`,
    });
  }

  // Funcionalidade existente
  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/auth/verify?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirme seu cadastro no Memorial Digital',
      html: `
        <h1>Bem-vindo ao Memorial Digital!</h1>
        <p>Para concluir seu cadastro e ativar sua conta, clique no link abaixo:</p>
        <a href="${url}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Confirmar meu e-mail</a>
        <p>Se você não solicitou este cadastro, por favor, ignore este e-mail.</p>
      `,
    });
  }

  // Funcionalidade de recuperação de senha (URL corrigida para o endpoint POST correto)
  async sendResetPasswordEmail(email: string, token: string) {
    const url = `http://localhost:3000/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperação de Senha',
      html: `
        <h1>Recuperação de Senha</h1>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Para criar uma nova senha, clique no botão abaixo:</p>
        <a href="${url}" style="padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Redefinir minha senha</a>
        <p>Este link expirará em 15 minutos. Se você não solicitou esta alteração, ignore este e-mail.</p>
      `,
    });
  }
}
