import { ConflictException, Injectable } from '@nestjs/common';
import { SignUpDto } from './DTO/sign-up.dto';
import { hashPassword } from 'src/utils/password.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { getLocalFormattedDate } from 'src/utils/date.util';
import { capitalizeFirstletter } from 'src/utils/capitalize-first-letter';
import { CreatedUser, User } from 'src/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private mail: MailService,
  ) {}

  private async isEmailRegistered(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { userId: true },
    });

    return user !== null;
  }

  async createUser(user: SignUpDto) {
    const emailExists = await this.isEmailRegistered(user.email);

    if (emailExists) {
      throw new ConflictException('Este email ya está registrado.');
    }

    const { password, name, lastname, email } = user;

    const passwordHash = await hashPassword(password);

    const createdUser = await this.prisma.user.create({
      data: {
        name: capitalizeFirstletter(name),
        lastname: capitalizeFirstletter(lastname),
        email,
        passwordHash,
      },
      select: {
        name: true,
        lastname: true,
        email: true,
        createdAt: true,
      },
    });

    this.mail.welcomeEmail(createdUser);

    return {
      createdUser,
      message: 'Cuenta creada exitosamente. Por favor checa tu email.',
    };
  }
}
function getLocalISODate(date: Date) {
  throw new Error('Function not implemented.');
}
