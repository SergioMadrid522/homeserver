import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import type { Request } from 'express';
import { LoggerGuard } from 'src/logger/logger.guard';
import { User } from 'src/usuario.decorator';
import type { Credentials } from './types/user.types';
import { EditFolderDto } from './DTO/edit-folder.dto';
import { CreateFolderDto } from './DTO/create-folder.dto';

@Controller('/folders')
@UseGuards(LoggerGuard)
export class FolderController {
  constructor(private folderService: FolderService) {}

  @Get()
  ViewFolders(@User() credentials: Credentials) {
    return this.folderService.viewAllFolders(credentials);
  }

  @Get('/:id/folder-data')
  GetFolderData(@Param('id') id: string, @User() credentials: Credentials) {
    return this.folderService.getFolderData(Number(id), credentials);
  }

  @Get('/favorites')
  GetFavoritesFolders(@User() credentials: Credentials) {
    return this.folderService.getFavoriteFolders(credentials);
  }

  @Patch('/:id/trash')
  MoveToTrash(@Param('id') id: string, @User() credentials: Credentials) {
    return this.folderService.moveToTrash(Number(id), credentials);
  }

  @Delete('/:id/trash')
  DeleteFolder(@Param('id') id: string, @User() credentials: Credentials) {
    return this.folderService.deleteFolder(Number(id), credentials);
  }

  @Patch('/:id/favorite')
  AddToFavorite(@Param('id') id: string, @User() credentials: Credentials) {
    return this.folderService.addToFavorite(Number(id), credentials);
  }

  @Patch('/:id/edit-folder')
  EditFolder(
    @Param('id') id: string,
    @User() credentials: Credentials,
    @Body() body: EditFolderDto,
  ) {
    return this.folderService.editFolder(Number(id), credentials, body);
  }
  @Post('/create-folder')
  CreateFolder(
    @User() credentials: Credentials,
    @Body() body: CreateFolderDto,
  ) {
    return this.folderService.createFolder(credentials, body);
  }
}
