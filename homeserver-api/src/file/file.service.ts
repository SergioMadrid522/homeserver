import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Credentials } from 'src/types/user.types';
import { EditFileDto } from './DTO/edit-file.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as crypto from 'crypto';
import type { Metadata } from './types/metadata.type';
import type { Folder } from './types/folders-path.type';
import path from 'path';
import { DeleteFilesQueryParamsDto } from './DTO/delete-files-query-params.dto';

@Injectable()
export class FileService {
  private readonly baseDisk;

  constructor(private readonly prisma: PrismaService) {
    this.baseDisk = process.env.DISK_PATH;

    if (!this.baseDisk) {
      throw new Error('La variable DISK_PATH no esta definida');
    }
  }

  private async getFolderPath(
    folderId: number,
    userId: number,
  ): Promise<Folder[]> {
    return this.prisma.$queryRaw<Folder[]>`
      with recursive folderHierarchy as(
        SELECT 
          folder_id as targetFolderId,
          folder_id as folderId,
          cast(title as varchar(500)) as title,
          parent_folder as parentFolder,
          cast(storage_name as varchar(500)) as folderPath,
          user_id as userId
        FROM folders
        union all
        select
          fh.targetfolderid,
          f.folder_id as folderId,
          cast(fh.title || f.title as varchar(500)) as title,
          f.parent_folder as parentFolder,
          cast(f.storage_name || '/' || fh.folderPath as varchar(500)) as folderPath,
          f.user_id as userId
        from folders f
        inner join folderHierarchy fh
          on f.folder_id = fh.parentFolder
      )
      select targetfolderid as id, folderPath as path
      from folderHierarchy
      where targetFolderId = ${folderId}
      and userid = ${userId}
      and parentfolder is null; 
      `;
  }

  private async getFolderPaths(
    folderId: number,
    userId: number,
  ): Promise<Folder[]> {
    return this.prisma.$queryRaw<Folder[]>`
      with recursive folderHierarchy as(
        SELECT 
          folder_id as targetFolderId,
          folder_id as folderId,
          cast(title as varchar(500)) as title,
          parent_folder as parentFolder,
          cast(storage_name as varchar(500)) as folderPath,
          user_id as userId
        FROM folders
        union all
        select
          fh.targetfolderid,
          f.folder_id as folderId,
          cast(fh.title || f.title as varchar(500)) as title,
          f.parent_folder as parentFolder,
          cast(f.storage_name || '/' || fh.folderPath as varchar(500)) as folderPath,
          f.user_id as userId
        from folders f
        inner join folderHierarchy fh
          on f.folder_id = fh.parentFolder
      )
      select targetfolderid as id, folderPath as path
      from folderHierarchy
      where targetFolderId in (${folderId})
      and userid = ${userId}
      and parentfolder is null; 
      `;
  }

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

  private async validateUserAndFolders(
    folderIds: number[],
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

    const folderExists = await this.prisma.folder.findMany({
      where: { folderId: { in: folderIds }, userId: credentials.userId },
      select: { folderId: true },
    });

    if (!folderExists) {
      return {
        code: 404,
        message: 'El folder al que intenta acceder no existe.',
      };
    }
  }

  private createChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  async uploadFiles(
    folderId: number,
    credentials: Credentials,
    files: Express.Multer.File[],
  ) {
    const validation = await this.validateUserAndFolder(folderId, credentials);

    if (validation?.code === 401) {
      throw new UnauthorizedException(validation?.message);
    }
    if (validation?.code === 404) {
      throw new NotFoundException(validation?.message);
    }
    if (files.length === 0) {
      throw new BadRequestException('No se ha seleccionado ningún archivo');
    }

    const metadata: Metadata[] = [];

    files.map((file) => {
      metadata.push({
        name: file.originalname,
        storageName: uuidv4(),
        mimeType: file.mimetype,
        size: file.size,
        uploadedAt: new Date(),
        buffer: file.buffer,
        checksum: this.createChecksum(file.buffer),
      });
    });

    const folders = await this.getFolderPath(folderId, credentials.userId);

    const folder = folders[0];

    const user = await this.prisma.user.findUnique({
      where: { userId: credentials.userId },
      select: { userStorageId: true },
    });

    const __dirname: string = path.join(
      this.baseDisk,
      user?.userStorageId!,
      folder.path,
    );

    if (!fs.existsSync(__dirname)) {
      throw new NotFoundException('carpeta no existe');
    }

    let fullPath: string[] = [];

    metadata.forEach((file) => {
      fullPath.push(path.join(__dirname, file.storageName));
    });

    let writeStream;
    //const uploadFileFlag: UploadFileFlag[] = [{ flag: false, name: '' }];
    let sizeAcum: bigint = 0n;

    try {
      fullPath.map((path) => {
        metadata.map(({ name, buffer, size }) => {
          // uploadFileFlag.shift();

          writeStream = fs.createWriteStream(path);
          writeStream.write(buffer);
          sizeAcum += BigInt(size);
          /* uploadFileFlag.push({
            flag: true,
            name,
          }); */
        });
        writeStream.end();
      });

      writeStream.on('finish', () => {
        console.log('All data has been flushed to the folder.');
      });

      writeStream.on('error', (error: any) => {
        console.log(error.message);
      });

      metadata.map(async (data) => {
        const { buffer, ...metadata } = data;

        await this.prisma.$transaction([
          this.prisma.file.create({
            data: {
              ...metadata,
              folderId,
              userId: credentials.userId,
            },
          }),
          this.prisma.user.update({
            where: { userId: credentials.userId },
            data: {
              currentStorage: { increment: sizeAcum },
              storageLimit: { decrement: sizeAcum },
            },
          }),
        ]);
      });

      return {
        mensaje: 'Se han subido los archivos exitosamente.',
      };
    } catch (error: any) {
      /* if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'EEXIST'
      ) {
        const filesInBd = await this.prisma.file.findMany({
          where: { folderId, userId: credentials.userId },
          select: { name: true },
        });

        let filesNames = new Set(filesInBd.map((file) => file.name));

        let fileUploaded = files.map((f) => f.originalname);
        let counter: number = 1;

        fileUploaded.map((fileName) => {
          while (filesNames.has(fileName)) {
            fileUploaded = `${fileName} (${counter})`;
            counter++;
          }
        });
      } */
      /* uploadFileFlag.find(
        (file) =>
          false === file.flag &&
          errorMessage.push(
            `El archivo ${file.name} no se ha podido subir, por favor intente otra vez.`,
          ),
      ); */
      return error.message;
    }
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

    const updatedAt = new Date();

    await this.prisma.file.update({
      where: { fileId, folderId, userId: credentials.userId },
      data: { isDeleted: true, updatedAt },
    });

    return {
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

  async addToFavorite(
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
      data: { isFavorite: true, updatedAt },
    });

    return {
      message: 'El archivo se agregó a sus favoritos.',
    };
  }

  async deleteFile(fileId: number, folderId: number, credentials: Credentials) {
    const validation = await this.validateUserAndFolder(folderId, credentials);

    if (validation?.code === 401) {
      throw new UnauthorizedException(validation?.message);
    }

    if (validation?.code === 404) {
      throw new NotFoundException(validation?.message);
    }

    const fileExists = await this.prisma.file.findUnique({
      where: { fileId },
      select: { fileId: true, isDeleted: true, storageName: true },
    });

    if (!fileExists) {
      throw new NotFoundException('El archivo que intenta borrar no existe.');
    }

    if (!fileExists.isDeleted) {
      throw new BadRequestException(
        'El archivo que intentas borrar no está en la papelera de reciclaje',
      );
    }

    const folder = await this.getFolderPath(folderId, credentials.userId);

    const user = await this.prisma.user.findUnique({
      where: { userId: credentials.userId },
      select: { userStorageId: true },
    });

    const fullPath = path.join(
      this.baseDisk,
      user?.userStorageId!,
      folder[0].path,
      fileExists.storageName,
    );

    fs.unlink(fullPath, async (error) => {
      if (error) {
        throw new BadRequestException(
          'No se ha podido borrar el archivo del servidor, intente nuevamente.',
        );
      }

      await this.prisma.file.delete({
        where: { fileId, folderId, userId: credentials.userId },
      });
    });

    return {
      message: 'Se ha borrado con éxito',
    };
  }

  async deleteFiles(
    query: DeleteFilesQueryParamsDto,
    credentials: Credentials,
  ) {
    const folderIds: number[] = [];

    const splitFolderIds = query.folderIds.split(',');

    splitFolderIds.forEach((id) => {
      folderIds.push(Number(id));
    });

    const validation = await this.validateUserAndFolders(
      folderIds,
      credentials,
    );

    if (validation?.code === 401) {
      throw new UnauthorizedException(validation?.message);
    }

    if (validation?.code === 404) {
      throw new NotFoundException(validation?.message);
    }

    const filesIds: number[] = [];

    const ids = query.fileIds.split(',');

    ids.forEach((id) => {
      filesIds.push(Number(id));
    });

    const filesExist = await this.prisma.file.findMany({
      where: { fileId: { in: filesIds } },
      select: {
        fileId: true,
        isDeleted: true,
        storageName: true,
        folder: { select: { storageName: true } },
      },
    });

    if (!filesExist) {
      throw new NotFoundException('El archivo que intenta borrar no existe.');
    }

    const folderPromises = folderIds.map(async (folderId) => {
      return await this.getFolderPaths(folderId, credentials.userId);
    });

    const resolvedFolders = await Promise.all(folderPromises);

    const folders: Folder[] = resolvedFolders.flat();

    const user = await this.prisma.user.findUnique({
      where: { userId: credentials.userId },
      select: { userStorageId: true },
    });

    const __dirname: string[] = [];

    folders.forEach((f) => {
      __dirname.push(
        path.join(
          this.baseDisk,
          user?.userStorageId!,
          f.path,
          //filesExist.storageName,
        ),
      );
    });

    const fullPath: string[] = [];

    filesExist.map(({ storageName }) => {
      console.log(storageName);
    });

    return {
      message: 'Se ha borrado con éxito',
      folders,
      __dirname,
      filesExist,
    };
  }
}
