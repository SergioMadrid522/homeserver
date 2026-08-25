import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { LoggerGuard } from 'src/logger/logger.guard';
import { User } from 'src/usuario.decorator';
import type { Credentials } from 'src/types/user.types';
import { EditFileDto } from './DTO/edit-file.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('files')
@UseGuards(LoggerGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload-file')
  @UseInterceptors(FilesInterceptor('files'))
  UploadFile(
    @Query('folderId', ParseIntPipe) folderId: number,
    @User() credentials: Credentials,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.fileService.uploadFiles(folderId, credentials, files);
  }

  @Patch('/:id/move-to-trash')
  MoveToTrash(
    @Param('id', ParseIntPipe) fileId: number,
    @Query('folderId', ParseIntPipe) folderId: number,
    @User() credentials: Credentials,
  ) {
    return this.fileService.moveToTrash(fileId, folderId, credentials);
  }

  @Patch('/:id/favorite')
  AddToFavorite(
    @Param('id', ParseIntPipe) fileId: number,
    @Query('folderId', ParseIntPipe) folderId: number,
    @User() credentials: Credentials,
  ) {
    return this.fileService.addToFavorite(fileId, folderId, credentials);
  }

  @Patch('/:id/edit-file')
  EditFile(
    @Param('id', ParseIntPipe) fileId: number,
    @Query('folderId', ParseIntPipe) folderId: number,
    @User() credentials: Credentials,
    @Body() body: EditFileDto,
  ) {
    return this.fileService.editFile(body, fileId, folderId, credentials);
  }

  @Delete('/:id/delete-file')
  DeleteFile(
    @Param('id', ParseIntPipe) fileId: number,
    @Query('folderId', ParseIntPipe) folderId: number,
    @User() credentials: Credentials,
  ) {
    return this.fileService.deleteFile(fileId, folderId, credentials);
  }
}
