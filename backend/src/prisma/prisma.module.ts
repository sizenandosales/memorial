import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 🛡️ Deixa a conexão do banco disponível globalmente no sistema
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporta para que os outros módulos usem o Prisma
})
export class PrismaModule {}
