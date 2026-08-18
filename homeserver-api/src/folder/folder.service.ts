import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Credentials } from './types/user.types';
import { EditFolderDto } from './DTO/edit-folder.dto';
import { CreateFolderDto } from './DTO/create-folder.dto';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import type {
  ParentFolders,
  ChildrenFolders,
  FolderHierarchy,
} from './types/FolderHierarchy.type';
import { ZipfilesService } from 'src/zipfiles/zipfiles.service';

@Injectable()
export class FolderService {
  private readonly baseDisk;

  constructor(
    private readonly prisma: PrismaService,
    private zipFile: ZipfilesService,
  ) {
    this.baseDisk = process.env.DISK_PATH;

    if (!this.baseDisk) {
      throw new Error('La variable DISK_PATH no esta definida');
    }
  }

  private async getFolderDescendants(
    folderId: number,
    userId: number,
  ): Promise<FolderHierarchy[]> {
    return await this.prisma.$queryRaw<FolderHierarchy[]>`
      WITH RECURSIVE folderDescendants AS (
        SELECT
          folder_id,
          title,
          parent_folder,
          storage_name
        FROM folders
        WHERE folder_id = ${folderId}
          AND user_id = ${userId}
        UNION ALL
        SELECT
          f.folder_id,
          f.title,
          f.parent_folder,
          f.storage_name
        FROM folders f
        INNER JOIN folderDescendants ch
          ON f.parent_folder = ch.folder_id
      )
      SELECT * FROM folderDescendants order by folder_id asc;
    `;
  }

  private async getFolderAncestors(
    parentFolderId: number | null | undefined,
    userId: number,
  ): Promise<FolderHierarchy[]> {
    return await this.prisma.$queryRaw<FolderHierarchy[]>`
    with recursive carpetas_hijas as(
      SELECT 
        folder_id,
        title,
        parent_folder,
        storage_name
      FROM folders  
      where folder_id = ${parentFolderId} and user_id = ${userId}
      union all
      select
        f.folder_id,
        f.title,
        f.parent_folder,
        f.storage_name
      from folders f
      inner join carpetas_hijas ch
        on  f.folder_id = ch.parent_folder
    )
    select * from carpetas_hijas;
    `;
  }

  async getFolders(credentials: Credentials) {
    const folders = await this.prisma.folder.findMany({
      where: { userId: credentials.userId, isDeleted: false },
    });

    if (folders.length === 0) {
      throw new BadRequestException('Por ahora no hay nada que mostrar.');
    }

    return {
      folders,
    };
  }

  async getFolderData(folderId: number, credentials: Credentials) {
    const folder = await this.prisma.folder.findUnique({
      where: { folderId, userId: credentials.userId },
      select: {
        title: true,
        files: true,
        children: true,
        parent: true,
        storageName: true,
        isFavorite: true,
      },
    });

    if (!folder) {
      throw new BadRequestException('No hay nada para mostrar.');
    }

    return {
      folder,
    };
  }

  async getFavoriteFolders(credentials: Credentials) {
    const favoriteFolders = await this.prisma.folder.findMany({
      where: { userId: credentials.userId, isFavorite: true },
    });

    if (favoriteFolders.length === 0) {
      throw new NotFoundException(
        'No tienes ninguna carpeta agregada a favoritos.',
      );
    }
    return {
      favoriteFolders,
    };
  }

  async downloadFolder(folderId: number, credentials: Credentials) {
    const folder = await this.prisma.folder.findUnique({
      where: { folderId, userId: credentials.userId },
      select: { isDeleted: true, storageName: true, title: true },
    });

    if (!folder) {
      throw new BadRequestException(
        'La carpeta que intentas borrar no existe o no está en la papelera de reciclaje.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { userId: credentials.userId },
      select: { userStorageId: true },
    });

    if (!user) {
      throw new NotFoundException('No hay ningún usuario activo.');
    }

    const getFolderPath = await this.getFolderAncestors(
      folderId,
      credentials.userId,
    );

    const folderParents: ParentFolders[] = getFolderPath.map((folder) => ({
      title: folder.title,
      uuid: folder.storage_name,
    }));

    const getChildrenFolders = await this.getFolderDescendants(
      folderId,
      credentials.userId,
    );

    const childrenFolders: ChildrenFolders[] = getChildrenFolders.map(
      (folder) => ({
        folderId: folder.folder_id,
        title: folder.title,
        uuid: folder.storage_name,
        parentId: folder.parent_folder,
      }),
    );

    const finalFolderPath = path.join(
      this.baseDisk,
      user.userStorageId,
      ...folderParents.map((folder) => folder.uuid),
    );

    await this.zipFile.CreateZipFolder(
      finalFolderPath,
      folder.title,
      childrenFolders,
    );

    return {
      message: 'Se ha descargado con éxito',
    };
  }

  async moveToTrash(folderId: number, credentials: Credentials) {
    const folderExists = await this.prisma.folder.findUnique({
      where: { folderId, userId: credentials.userId },
    });

    if (!folderExists) {
      throw new BadRequestException(
        'La carpeta que intentas mover a la papelera de reciclaje no existe.',
      );
    }
    const deletedAt = new Date();

    await this.prisma.folder.update({
      where: { folderId, userId: credentials.userId },
      data: { isDeleted: true, deletedAt },
    });

    return {
      message: 'Se movió con éxito a la papelera de reciclaje.',
    };
  }

  async recoverFolderFromTrash(folderId: number, credentials: Credentials) {
    const folderExists = await this.prisma.folder.findUnique({
      where: { folderId, userId: credentials.userId, isDeleted: true },
      select: { isDeleted: true },
    });

    if (!folderExists?.isDeleted) {
      throw new BadRequestException(
        'La carpeta que intentas recuperar no está en la papelera de reciclaje o no existe.',
      );
    }

    const updatedAt = new Date();

    await this.prisma.folder.update({
      where: { folderId, userId: credentials.userId },
      data: { isDeleted: false, updatedAt },
    });

    return {
      message: 'Se recuperó con éxito.',
    };
  }

  async deleteFolder(folderId: number, credentials: Credentials) {
    const folderExists = await this.prisma.folder.findUnique({
      where: { folderId, userId: credentials.userId },
      select: { isDeleted: true, storageName: true },
    });

    if (!folderExists) {
      throw new BadRequestException(
        'La carpeta que intentas borrar no existe o no está en la papelera de reciclaje.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { userId: credentials.userId },
      select: { userStorageId: true },
    });

    if (!user) {
      throw new NotFoundException('No hay ningún usuario activo.');
    }

    const __dirname = path.join(
      this.baseDisk,
      user.userStorageId,
      folderExists.storageName,
    );

    try {
      await fs.rm(__dirname, { recursive: true, force: true });

      await this.prisma.folder.delete({
        where: { folderId, userId: credentials.userId, isDeleted: true },
      });
    } catch (error) {
      throw new BadRequestException('No se pudo eliminar la carpeta.');
    }

    return {
      message: 'La carpeta se ha borrado con éxito.',
    };
  }

  async addToFavorite(folderId: number, credentials: Credentials) {
    const folderExists = await this.prisma.folder.findUnique({
      where: { folderId, userId: credentials.userId },
    });

    if (!folderExists) {
      throw new NotFoundException('No hay nada para mostrar.');
    }

    const updatedAt = new Date();

    await this.prisma.folder.update({
      where: { folderId, userId: credentials.userId },
      data: { isFavorite: true, updatedAt },
    });

    return {
      message: 'La carpeta se agregó a sus favoritos.',
    };
  }

  async editFolder(
    folderId: number,
    credentials: Credentials,
    body: EditFolderDto,
  ) {
    const folder = await this.prisma.folder.findUnique({
      where: { folderId, userId: credentials.userId },
      select: { userId: true },
    });

    if (!folder) {
      throw new NotFoundException('La carpeta que quiere modifcar no existe.');
    }

    const updatedAt = new Date();

    await this.prisma.folder.update({
      where: { folderId, userId: credentials.userId },
      data: { ...body, updatedAt },
    });

    return {
      message: 'Se ha modificado la carpeta con éxito.',
    };
  }

  async createFolder(credentials: Credentials, body: CreateFolderDto) {
    const folders = await this.prisma.folder.findMany({
      where: {
        userId: credentials.userId,
        isDeleted: false,
        parentFolderId: body.parentFolderId,
      },
      select: { title: true, storageName: true, parentFolderId: true },
    });

    const createdAt = new Date();
    const storageName = uuidv4();

    const folderHierarchy = await this.getFolderAncestors(
      body.parentFolderId,
      credentials.userId,
    );

    const user = await this.prisma.user.findUnique({
      where: { userId: credentials.userId },
      select: { userStorageId: true },
    });

    if (!user) {
      throw new BadRequestException('No hay un usuario activo');
    }

    const getParentStorageName = folderHierarchy
      .map((folder) => folder.storage_name)
      .reverse()
      .join('/');

    let targetDirectory: string;

    if (!getParentStorageName) {
      targetDirectory = path.join(
        this.baseDisk,
        user.userStorageId,
        storageName,
      );
    } else {
      targetDirectory = path.join(
        this.baseDisk,
        user.userStorageId,
        getParentStorageName,
        storageName,
      );
    }

    let directoryCreated = false;
    try {
      await fs.mkdir(targetDirectory);
      directoryCreated = true;

      await this.prisma.$transaction([
        this.prisma.folder.create({
          data: {
            title: body.title,
            createdAt,
            storageName,

            user: {
              connect: {
                userId: credentials.userId,
              },
            },

            ...(body.parentFolderId && {
              parent: {
                connect: {
                  folderId: body.parentFolderId,
                },
              },
            }),
          },
        }),

        this.prisma.folder.update({
          where: { userId: credentials.userId, storageName },
          data: {
            user: {
              update: {
                storageLimit: {
                  decrement: 4096n,
                },
              },
            },
          },
        }),
      ]);

      return {
        message: 'Se ha creado la carpeta con éxito.',
      };
    } catch (error: unknown) {
      if (directoryCreated) {
        await fs.rm(targetDirectory, {
          recursive: true,
          force: true,
        });
      }
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'EEXIST'
      ) {
        let folderNames = new Set(folders.map((folder) => folder.title));
        let finalName = body.title;
        let counter: number = 1;

        while (folderNames.has(finalName)) {
          finalName = `${body.title} (${counter})`;
          counter++;
        }

        await this.prisma.folder.create({
          data: {
            title: finalName,
            createdAt,
            storageName,
            user: {
              connect: {
                userId: credentials.userId,
              },
            },

            ...(body.parentFolderId && {
              parent: {
                connect: {
                  folderId: body.parentFolderId,
                },
              },
            }),
          },
        });
      } else {
        throw new BadRequestException(
          'No se pudo crear la carpeta, por favor intenta más tarde.',
        );
      }
    }
  }
}
