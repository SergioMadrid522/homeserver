import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './DTO/sign-up.dto';
import { comparePassword, hashPassword } from 'src/utils/password.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { capitalizeFirstletter } from 'src/utils/capitalize-first-letter';
import { LoginDto } from './DTO/login.dto';
import { Response } from 'express';
import { setAuthCookie } from 'src/setCookie/set-session-cookie';
import { signJwt } from 'src/setCookie/jwt';

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

  async login(credentials: LoginDto, response: Response) {
    const registeredUser = await this.prisma.user.findUnique({
      where: { email: credentials.email },
      select: {
        userId: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true,
        emailVerified: true,
      },
    });

    if (!registeredUser) {
      throw new UnauthorizedException(
        'Correo electrónico o contraseña incorrectos.',
      );
    }

    const passwordMatches = await comparePassword(
      credentials.password,
      registeredUser.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Correo electrónico o contraseña incorrectos.',
      );
    }

    if (!registeredUser.isActive) {
      throw new ForbiddenException('La cuenta está deshabilitada.');
    }

    if (!registeredUser.emailVerified) {
      throw new ForbiddenException(
        'Debes verificar tu correo electrónico antes de iniciar sesión.',
      );
    }

    const token = await signJwt({
      sub: registeredUser.userId,
      email: registeredUser.email,
      role: registeredUser.role,
    });

    setAuthCookie(response, token);

    return {
      success: true,
      message: 'Se ha iniciado sesión con éxito.',
    };
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
      message: 'Cuenta creada exitosamente. Por favor checa tu email.',
    };
  }

  logout(res: Response) {
    res.clearCookie('sessionCookie');
  }
}
