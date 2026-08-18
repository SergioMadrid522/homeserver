import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as archiver from 'archiver';
import path from 'path';
import type {
  ParentFolders,
  ChildrenFolders,
  ZipFolderHierarchy,
} from 'src/folder/types/FolderHierarchy.type';
@Injectable()
export class ZipfilesService {
  private output;
  private readonly archive;

  constructor() {
    this.archive = new archiver.ZipArchive({ zlib: { level: 9 } });
  }

  private getFolderZipPath(
    folderId: number,
    folders: ChildrenFolders[],
    rootPath: string,
  ): string {
    const folder = folders.find((folder) => folder.folderId === folderId);

    if (!folder) {
      throw new Error(`Folder ${folderId} no encontrado`);
    }

    if (folder.parentId === null) {
      return rootPath;
    }

    const parentPath = this.getFolderZipPath(
      folder.parentId,
      folders,
      rootPath,
    );

    return path.join(parentPath, folder.title);
  }

  private async addFolderToZip(
    physicalPath: string,
    zipPath: string,
    childrenFolders: ChildrenFolders[],
  ) {
    this.archive.append('', {
      name: `${zipPath}/`,
    });

    const entries = await fs.promises.readdir(physicalPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const physicalEntryPath = path.join(physicalPath, entry.name);

      if (entry.isFile()) {
        this.archive.file(physicalEntryPath, {
          name: path.join(zipPath, entry.name),
        });

        continue;
      }

      if (!entry.isDirectory()) continue;

      const childFolder = childrenFolders.find(
        (folder) => folder.uuid === entry.name,
      );

      if (!childFolder) {
        throw new Error(`No se encontró ${entry.name} en childrenFolders`);
      }

      const childZipPath = path.join(zipPath, childFolder.title);

      await this.addFolderToZip(
        physicalEntryPath,
        childZipPath,
        childrenFolders,
      );
    }
  }
  async CreateZipFolder(
    folderPath: string,
    folderName: string,
    childrenFolders: ChildrenFolders[],
  ) {
    this.output = fs.createWriteStream('../../Desktop/' + Date.now() + '.zip');

    this.archive.pipe(this.output);

    await this.addFolderToZip(folderPath, folderName, childrenFolders);

    /* console.table(childrenFolders);
    
    for (const folder of childrenFolders) {
      const zipPath = this.getFolderZipPath(
        folder.folderId,
        childrenFolders,
        folderName,
      );

      console.log(zipPath);
    } */

    this.archive.on('error', function (error) {
      console.error('Fatal archiver error:', error.message);
      throw Error(error.message);
    });

    this.output.on('close', () => {
      console.log('Zip file successfully written to disk.');
    });
    this.archive.finalize();
  }
}
