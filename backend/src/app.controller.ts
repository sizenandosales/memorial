import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Memorial SaaS API - Rodando com Sucesso! 🚀';
  }
}
