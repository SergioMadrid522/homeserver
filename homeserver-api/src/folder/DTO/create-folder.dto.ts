import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  title!: string;

  @IsNumber()
  @IsOptional()
  parentFolderId!: number | null | undefined;
}
