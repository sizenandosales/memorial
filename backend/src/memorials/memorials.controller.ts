import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MemorialsService } from './memorials.service';
import { CreateMemorialDto } from './dto/create-memorial.dto';
import { UpdateMemorialDto } from './dto/update-memorial.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('memorials')
export class MemorialsController {
  constructor(private readonly memorialsService: MemorialsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'gallery', maxCount: 10 },
    ]),
  )
  async create(
    @Body() createMemorialDto: CreateMemorialDto,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.memorialsService.create(createMemorialDto, files, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    return this.memorialsService.findAll(userId);
  }

  // ROTAS ESPECÍFICAS COM :id DEVEM VIR ANTES DA ROTA GENÉRICA :slug
  @Get(':id/approved-messages')
  async getApprovedMessages(@Param('id') id: string) {
    return this.memorialsService.getApprovedMessages(id);
  }

  // Rota pública para o visitante enviar mensagem no mural do memorial
  @Post(':id/messages')
  async createVisitorMessage(
    @Param('id') id: string,
    @Body() body: { visitorName: string; message: string },
  ) {
    return this.memorialsService.createVisitorMessage(id, body);
  }

  // Rota dinâmica genérica por slug vem depois
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.memorialsService.findOne(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':slug')
  async update(
    @Param('slug') slug: string,
    @Body() updateMemorialDto: UpdateMemorialDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.memorialsService.update(slug, updateMemorialDto, userId);
  }

  // ATUALIZAR STATUS DO MEMORIAL (ATIVAR/PENDENTE)
  @UseGuards(JwtAuthGuard)
  @Patch(':slug/status')
  async updateStatus(
    @Param('slug') slug: string,
    @Body('status') status: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.memorialsService.updateStatus(slug, status, userId);
  }

  // --- NOVAS ROTAS DE MENSAGENS PARA MODERAÇÃO ---

  @UseGuards(JwtAuthGuard)
  @Get(':slug/messages/all')
  async getMemorialMessagesForModeration(
    @Param('slug') slug: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.memorialsService.getMessagesBySlug(slug, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('messages/:id/status')
  async updateMessageStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.memorialsService.updateMessageStatus(id, status);
  }

  // ----------------------------------------------

  @UseGuards(JwtAuthGuard)
  @Delete(':slug')
  async remove(@Param('slug') slug: string, @Request() req) {
    const userId = req.user.id;
    return this.memorialsService.remove(slug, userId);
  }
}
