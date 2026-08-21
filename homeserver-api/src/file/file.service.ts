import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Credentials } from 'src/types/user.types';
import { EditFileDto } from './DTO/edit-file.dto';

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateUserAndFolder(
    folderId: number,
    credentials: Credentials,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { userId: credentials.userId },
      select: { userId: true },
    });

    if (!user) {
      return {
        code: 401,
        message: 'Por favor inicie sesión.',
      };
    }

    const folderExists = await this.prisma.folder.findUnique({
      where: { folderId, userId: credentials.userId },
      select: { folderId: true },
    });

    if (!folderExists) {
      return {
        code: 404,
        message: 'El folder al que intenta acceder no existe.',
      };
    }
  }

  async getFiles(folderId: number, credentials: Credentials) {
    const validation = await this.validateUserAndFolder(folderId, credentials);

    if (validation?.code === 401) {
      throw new UnauthorizedException(validation?.message);
    }
    if (validation?.code === 404) {
      throw new NotFoundException(validation?.message);
    }

    const files = await this.prisma.folder.findMany({
      where: { userId: credentials.userId, folderId },
      select: {
        files: {
          select: {
            name: true,
            mimeType: true,
            isFavorite: true,
            updatedAt: true,
          },
        },
      },
    });

    if (files[0].files.length === 0) {
      throw new BadRequestException('No hay nada que mostrar');
    }

    return files;
  }

  async moveToTrash(
    fileId: number,
    folderId: number,
    credentials: Credentials,
  ) {
    const validation = await this.validateUserAndFolder(folderId, credentials);

    if (validation?.code === 401) {
      throw new UnauthorizedException(validation?.message);
    }
    if (validation?.code === 404) {
      throw new NotFoundException(validation?.message);
    }

    const file = await this.prisma.folder.findUnique({
      where: {
        folderId,
        userId: credentials.userId,
        files: { some: { fileId } },
      },
      select: { files: { select: { fileId: true } } },
    });

    if (!file) {
      throw new NotFoundException('El archivo que intentas borrar no existe.');
    }

    return {
      file,
      message: 'El archivo se movió correctamente a la papelera.',
    };
  }

  async editFile(
    body: EditFileDto,
    fileId: number,
    folderId: number,
    credentials: Credentials,
  ) {
    const validation = await this.validateUserAndFolder(folderId, credentials);

    if (validation?.code === 401) {
      throw new UnauthorizedException(validation?.message);
    }
    if (validation?.code === 404) {
      throw new NotFoundException(validation?.message);
    }

    const fileExists = await this.prisma.file.findUnique({
      where: { fileId },
      select: { fileId: true },
    });

    if (!fileExists) {
      throw new NotFoundException(
        'El archivo que intenta modificar no existe.',
      );
    }

    const updatedAt = new Date();

    await this.prisma.file.update({
      where: { fileId, userId: credentials.userId },
      data: {
        name: body.name,
        updatedAt,
      },
    });

    return {
      message: 'Se modificó el nombre al archivo.',
    };
  }
}
