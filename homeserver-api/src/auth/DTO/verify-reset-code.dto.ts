import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyResetCodeDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  email!: string;

  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  resetCode!: string;
}
