import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Na versão estável, o super() vazio lê o arquivo .env automaticamente sem quebrar!
    super();
  }

  async onModuleInit() {
    // Abre a conexão com o banco Neon assim que o NestJS inicializa
    await this.$connect();
  }

  async onModuleDestroy() {
    // Fecha a conexão limpamente se o servidor for desligado
    await this.$disconnect();
  }
}
