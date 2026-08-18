import { Module } from '@nestjs/common';
import { MuralMessagesController } from './mural-messages.controller';
import { MuralMessagesService } from './mural-messages.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // Importe o AuthModule

@Module({
  imports: [PrismaModule, AuthModule], // Adicione AuthModule aqui
  controllers: [MuralMessagesController],
  providers: [MuralMessagesService],
})
export class MuralMessagesModule {}
