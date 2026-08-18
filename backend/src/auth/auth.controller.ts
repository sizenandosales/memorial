import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    if (!body.userId || !body.refreshToken) {
      throw new UnauthorizedException('Dados incompletos para refresh');
    }
    return this.authService.refresh(body.userId, body.refreshToken);
  }

  @Post('register')
  async register(@Body() userData: any) {
    return this.authService.register(userData);
  }

  @Get('verify')
  async verify(@Query('token') token: string) {
    if (!token) {
      throw new UnauthorizedException('Token de verificação ausente');
    }
    return this.authService.verifyEmail(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    if (!body.token || !body.newPassword) {
      throw new UnauthorizedException('Token e nova senha são obrigatórios');
    }
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
