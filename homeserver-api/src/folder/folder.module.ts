import { Module } from '@nestjs/common';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { ZipfilesModule } from 'src/zipfiles/zipfiles.module';

@Module({
  controllers: [FolderController],
  providers: [FolderService],
  imports: [ZipfilesModule],
})
export class FolderModule {}
