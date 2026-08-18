import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MuralMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  // Validação centralizada para verificar se o usuário é dono do memorial
  async validateOwnership(memorialId: string, userId: string) {
    const memorial = await this.prisma.memorial.findUnique({
      where: { id: memorialId },
      select: { userId: true },
    });

    if (!memorial || memorial.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para realizar esta ação.',
      );
    }
  }

  async create(memorialId: string, createMessageDto: CreateMessageDto) {
    return this.prisma.muralMessage.create({
      data: {
        ...createMessageDto,
        memorialId,
        status: 'PENDING',
      },
    });
  }

  async approveMessage(messageId: string, memorialId: string, userId: string) {
    await this.validateOwnership(memorialId, userId);
    return this.prisma.muralMessage.update({
      where: { id: messageId },
      data: { status: 'APPROVED' },
    });
  }

  async rejectMessage(messageId: string, memorialId: string, userId: string) {
    await this.validateOwnership(memorialId, userId);
    return this.prisma.muralMessage.update({
      where: { id: messageId },
      data: { status: 'REJECTED' },
    });
  }

  // Busca mensagens públicas com paginação
  async findApprovedByMemorial(
    memorialId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    return this.prisma.muralMessage.findMany({
      where: {
        memorialId,
        status: 'APPROVED',
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }

  // Busca todas as mensagens (painel do dono) com paginação
  async findAllByMemorial(
    memorialId: string,
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    await this.validateOwnership(memorialId, userId);
    const skip = (page - 1) * limit;
    return this.prisma.muralMessage.findMany({
      where: { memorialId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }
}
