import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard'; // Import do novo Guard
import { Roles } from '../auth/decorators/roles.decorator'; // Import do novo Decorator

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Mantemos pública para novos cadastros
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  // Protegemos a listagem exigindo token (JWT) E papel de ADMIN
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }
}
