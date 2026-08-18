import 'dotenv/config'; // Carrega as variáveis de ambiente do arquivo .env
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- HABILITAR CORS ---
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 1. Filtro global
  app.useGlobalFilters(new HttpExceptionFilter());

  // 2. Pipe de validação
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // --- CONFIGURAÇÃO DO SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('API Memorial Digital')
    .setDescription('Documentação dos endpoints da API de Memoriais')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // O Swagger estará acessível em: http://localhost:3000/api
  // -------------------------------

  await app.listen(3000);
  console.log('Servidor rodando na porta 3000');
}

bootstrap();
