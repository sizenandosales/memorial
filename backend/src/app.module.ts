import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Importante para carregar o .env
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { MemorialsModule } from './memorials/memorials.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { TasksModule } from './tasks/tasks.module';
import { MuralMessagesModule } from './mural-messages/mural-messages.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    // Carrega o .env globalmente para que todos os módulos acessem as variáveis
    ConfigModule.forRoot({ isGlobal: true }),

    // Habilita o agendamento de tarefas (Cron Jobs) globalmente
    ScheduleModule.forRoot(),

    // Módulos principais da sua aplicação
    PrismaModule,
    MemorialsModule,
    AuthModule,
    MailModule,
    MuralMessagesModule,
    TasksModule,
    SupabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
