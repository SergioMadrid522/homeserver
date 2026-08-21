import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileService } from './file.service';
import { LoggerGuard } from 'src/logger/logger.guard';
import { User } from 'src/usuario.decorator';
import type { Credentials } from 'src/types/user.types';
import { EditFileDto } from './DTO/edit-file.dto';

@Controller('files')
@UseGuards(LoggerGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  ViewFiles(
    @Query('folderId', ParseIntPipe) folderId: number,
    @User() credentials: Credentials,
  ) {
    return this.fileService.getFiles(folderId, credentials);
  }

  @Patch('/:id/move-to-trash')
  MoveToTrash(
    @Param('id', ParseIntPipe) fileId: number,
    @Query('folderId', ParseIntPipe) folderId: number,
    @User() credentials: Credentials,
  ) {
    return this.fileService.moveToTrash(fileId, folderId, credentials);
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
}
