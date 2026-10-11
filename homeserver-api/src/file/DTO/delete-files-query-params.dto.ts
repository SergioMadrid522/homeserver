import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFilesQueryParamsDto {
  @IsString()
  @IsNotEmpty()
  fileIds!: string;

  @IsString()
  @IsNotEmpty()
  folderIds!: string;
}
