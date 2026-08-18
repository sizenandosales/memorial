import { Controller, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('test-email')
  async triggerTest() {
    // Isso executará a mesma lógica do agendamento manualmente
    await this.tasksService.handleExpirationCheck();
    return { message: 'Verificação de e-mails executada com sucesso!' };
  }
}
