import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class EditFolderDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  color!: string;
}
