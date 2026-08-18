import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Cria um novo usuário com a senha criptografada
  async create(data: any) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  // Lista todos os usuários SEM retornar o hash da senha
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        bairro: true,
        cep: true,
        cidade: true,
        complemento: true,
        document: true,
        logradouro: true,
        numero: true,
        phone: true,
        uf: true,
        isVerified: true,
        updatedAt: true,
      },
    });
  }

  // Busca um usuário pelo e-mail (necessário retornar a senha para validar o login)
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Busca por ID (também excluímos a senha por segurança)
  async findOneById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        refreshToken: true,
        // Senha excluída aqui
      },
    });
  }

  // Atualiza o hash do refresh token do usuário
  async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }
}
