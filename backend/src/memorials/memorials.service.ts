import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateMemorialDto } from './dto/create-memorial.dto';
import { UpdateMemorialDto } from './dto/update-memorial.dto';

@Injectable()
export class MemorialsService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  // Função auxiliar para normalizar e limpar strings para o formato de slug
  private formatSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  // Verifica a disponibilidade do slug e retorna uma sugestão caso esteja em uso
  async checkSlugAvailability(
    slug: string,
  ): Promise<{ available: boolean; suggestedSlug?: string }> {
    const normalizedSlug = this.formatSlug(slug);

    if (!normalizedSlug) {
      throw new BadRequestException('O slug fornecido é inválido.');
    }

    const existing = await this.prisma.memorial.findUnique({
      where: { slug: normalizedSlug },
    });

    if (!existing) {
      return { available: true };
    }

    // Sugere uma alternativa acrescentando o ano atual ou um sufixo numérico seguro
    const suggestedSlug = `${normalizedSlug}-${new Date().getFullYear()}`;
    return { available: false, suggestedSlug };
  }

  async create(
    createMemorialDto: CreateMemorialDto,
    files: {
      profilePicture?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    userId: string,
  ) {
    if (!files.profilePicture || files.profilePicture.length === 0) {
      throw new BadRequestException(
        'A foto de perfil (profilePicture) é obrigatória.',
      );
    }

    const profileFile = files.profilePicture[0];
    const profilePictureUrl = await this.supabaseService.uploadFile(
      profileFile,
      'profiles',
    );

    const galleryUrls: string[] = [];
    if (files.gallery && files.gallery.length > 0) {
      for (const image of files.gallery) {
        const imageUrl = await this.supabaseService.uploadFile(
          image,
          'gallery',
        );
        galleryUrls.push(imageUrl);
      }
    }

    // Se o usuário informou um slug customizado, usamo-lo; caso contrário, geramos a partir do fullName
    const rawSlug =
      createMemorialDto.slug && createMemorialDto.slug.trim() !== ''
        ? createMemorialDto.slug
        : createMemorialDto.fullName;

    const slug = this.formatSlug(rawSlug);

    // Valida se o slug gerado já existe no banco de dados para evitar duplicidade e erros 500
    const existingMemorial = await this.prisma.memorial.findUnique({
      where: { slug },
    });

    if (existingMemorial) {
      const suggestedSlug = `${slug}-${new Date().getFullYear()}`;
      throw new BadRequestException(
        `Este endereço já está em uso. Mude para outro de sua escolha ou use: ${suggestedSlug}`,
      );
    }

    return this.prisma.memorial.create({
      data: {
        fullName: createMemorialDto.fullName,
        birthCity: createMemorialDto.birthCity,
        deathCity: createMemorialDto.deathCity,
        cemetery: createMemorialDto.cemetery,
        biography: createMemorialDto.biography,
        status: createMemorialDto.status || 'PENDING',
        slug,
        birthDate: new Date(createMemorialDto.birthDate),
        deathDate: new Date(createMemorialDto.deathDate),
        expiresAt: createMemorialDto.expiresAt
          ? new Date(createMemorialDto.expiresAt)
          : null,
        partnerId:
          createMemorialDto.partnerId &&
          createMemorialDto.partnerId.trim() !== ''
            ? createMemorialDto.partnerId
            : null,
        profilePicture: profilePictureUrl,
        gallery: galleryUrls,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.memorial.findMany({
      where: { userId },
      include: { muralMessages: true },
    });
  }

  async findOne(slug: string) {
    const memorial = await this.prisma.memorial.findUnique({
      where: { slug },
      include: { muralMessages: true },
    });
    if (!memorial)
      throw new NotFoundException(`Memorial '${slug}' não encontrado.`);
    return memorial;
  }

  async update(
    slug: string,
    updateMemorialDto: UpdateMemorialDto,
    userId: string,
  ) {
    const memorial = await this.findOne(slug);
    if (memorial.userId !== userId)
      throw new ForbiddenException('Sem permissão.');

    // Se o slug estiver sendo atualizado, limpamos e verificamos unicidade
    let dataToUpdate: any = { ...updateMemorialDto };
    if (updateMemorialDto.slug) {
      const newSlug = this.formatSlug(updateMemorialDto.slug);
      if (newSlug !== memorial.slug) {
        const conflict = await this.prisma.memorial.findUnique({
          where: { slug: newSlug },
        });
        if (conflict) {
          const suggestedSlug = `${newSlug}-${new Date().getFullYear()}`;
          throw new BadRequestException(
            `Este endereço já está em uso. Mude para outro de sua escolha ou use: ${suggestedSlug}`,
          );
        }
        dataToUpdate.slug = newSlug;
      }
    }

    return this.prisma.memorial.update({
      where: { slug },
      data: dataToUpdate,
    });
  }

  async updateStatus(slug: string, status: string, userId: string) {
    const memorial = await this.findOne(slug);
    if (memorial.userId !== userId)
      throw new ForbiddenException('Sem permissão.');

    return this.prisma.memorial.update({
      where: { slug },
      data: { status },
    });
  }

  async getApprovedMessages(memorialId: string) {
    return this.prisma.muralMessage.findMany({
      where: {
        memorialId: memorialId,
        status: 'APPROVED',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createVisitorMessage(
    memorialId: string,
    data: { visitorName: string; message: string },
  ) {
    const memorial = await this.prisma.memorial.findUnique({
      where: { id: memorialId },
    });

    if (!memorial) {
      throw new NotFoundException('Memorial não encontrado.');
    }

    return this.prisma.muralMessage.create({
      data: {
        memorialId,
        visitorName: data.visitorName,
        message: data.message,
        status: 'PENDING',
      },
    });
  }

  async getMessagesBySlug(slug: string, userId: string) {
    const memorial = await this.prisma.memorial.findFirst({
      where: { slug, userId },
      include: {
        muralMessages: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!memorial) {
      throw new NotFoundException(
        'Memorial não encontrado ou você não tem permissão.',
      );
    }

    return memorial.muralMessages;
  }

  async updateMessageStatus(messageId: string, status: string) {
    const message = await this.prisma.muralMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Mensagem não encontrada.');
    }

    return this.prisma.muralMessage.update({
      where: { id: messageId },
      data: { status },
    });
  }

  async remove(slug: string, userId: string) {
    const memorial = await this.findOne(slug);
    if (memorial.userId !== userId)
      throw new ForbiddenException('Sem permissão.');
    return this.prisma.memorial.delete({ where: { slug } });
  }

  async addImage(slug: string, imageUrl: string, userId: string) {
    const memorial = await this.findOne(slug);
    if (memorial.userId !== userId)
      throw new ForbiddenException('Sem permissão.');

    return this.prisma.memorial.update({
      where: { slug },
      data: { gallery: { push: imageUrl } },
    });
  }

  async removeImage(slug: string, imageUrl: string, userId: string) {
    const memorial = await this.findOne(slug);
    if (memorial.userId !== userId)
      throw new ForbiddenException('Sem permissão.');

    const updatedGallery = memorial.gallery.filter((url) => url !== imageUrl);
    return this.prisma.memorial.update({
      where: { slug },
      data: { gallery: { set: updatedGallery } },
    });
  }
}
