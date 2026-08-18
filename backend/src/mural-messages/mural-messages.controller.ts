import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MuralMessagesService } from './mural-messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Mudança: O prefixo agora é 'mural', evitando conflito com 'memorials'
@Controller('mural/:memorialId/messages')
export class MuralMessagesController {
  constructor(private readonly muralMessagesService: MuralMessagesService) {}

  // POST: http://localhost:3000/mural/:memorialId/messages
  @Post()
  async create(
    @Param('memorialId') memorialId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.muralMessagesService.create(memorialId, createMessageDto);
  }

  // GET (Pública): http://localhost:3000/mural/:memorialId/messages/approved
  @Get('approved')
  async findApproved(
    @Param('memorialId') memorialId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.muralMessagesService.findApprovedByMemorial(
      memorialId,
      Number(page),
      Number(limit),
    );
  }

  // GET (Privada): http://localhost:3000/mural/:memorialId/messages
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Param('memorialId') memorialId: string,
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.muralMessagesService.findAllByMemorial(
      memorialId,
      req.user.id,
      Number(page),
      Number(limit),
    );
  }

  // PATCH (Aprovar): http://localhost:3000/mural/:memorialId/messages/:messageId/approve
  @UseGuards(JwtAuthGuard)
  @Patch(':messageId/approve')
  async approveMessage(
    @Param('memorialId') memorialId: string,
    @Param('messageId') messageId: string,
    @Request() req,
  ) {
    return this.muralMessagesService.approveMessage(
      messageId,
      memorialId,
      req.user.id,
    );
  }

  // PATCH (Rejeitar): http://localhost:3000/mural/:memorialId/messages/:messageId/reject
  @UseGuards(JwtAuthGuard)
  @Patch(':messageId/reject')
  async rejectMessage(
    @Param('memorialId') memorialId: string,
    @Param('messageId') messageId: string,
    @Request() req,
  ) {
    return this.muralMessagesService.rejectMessage(
      messageId,
      memorialId,
      req.user.id,
    );
  }
}
