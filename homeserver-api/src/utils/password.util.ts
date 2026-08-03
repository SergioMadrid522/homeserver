import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    throw error;
  }
}

export async function comparePassword(
  bodyPassword: string,
  password: string,
): Promise<boolean> {
  const isPasswordMatch = await bcrypt.compare(bodyPassword, password);

  if (!isPasswordMatch) {
    throw new ConflictException('Contraseñas invalidas');
  }

  return isPasswordMatch;
}
