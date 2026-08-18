import { Module } from '@nestjs/common';
import { ZipfilesService } from './zipfiles.service';

@Module({
  providers: [ZipfilesService],
  exports: [ZipfilesService],
})
export class ZipfilesModule {}
