import {
  BadRequestException,
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
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './DTO/forgot-password.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private mail: MailService,
  ) {}

  private async isEmailRegistered(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { userId: true },
    });

    return user !== null;
  }

  private generateCustomCode(length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let code = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      code += chars.charAt(randomIndex);
    }

    return code;
  }

  private generateResetToken(email: string) {
    const payload = { email };
    return this.jwtService.sign(payload, {
      secret: process.env.RESET_PASSWORD_SECRET,
      expiresIn: '5m',
    });
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

  async forgotPassword(credentials: ForgotPasswordDto) {
    const genericMessage =
      'Si encontramos una cuenta asociada a este correo electrónico, te enviaremos las instrucciones para restablecer tu contraseña.';

    const userExists = await this.prisma.user.findFirst({
      where: { email: credentials.email },
      select: { userId: true, email: true },
    });

    if (!userExists) {
      throw new BadRequestException(genericMessage);
    }

    const recovery = await this.prisma.recoverPassword.findFirst({
      where: { userId: userExists!.userId },
      orderBy: { createdAt: 'asc' },
    });

    if (recovery?.attempts! >= 3) {
      await this.prisma.recoverPassword.delete({
        where: { recoverId: recovery?.recoverId, userId: userExists.userId },
      });

      throw new BadRequestException(
        'se han detectado muchos intentos, intente de nuevo más tarde.',
      );
    }

    const countCodes = await this.prisma.recoverPassword.count({
      where: { userId: userExists.userId },
    });

    if (countCodes > 1) {
      await this.prisma.recoverPassword.deleteMany({
        where: { userId: userExists.userId },
      });
    }

    const verificationCode = this.generateCustomCode();
    const codeHash = await bcrypt.hash(verificationCode, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // add five minutes to the current time

    if (countCodes === 1) {
      await this.prisma.recoverPassword.update({
        where: { recoverId: recovery?.recoverId },
        data: { attempts: { increment: 1 } },
      });
    } else {
      await this.prisma.recoverPassword.create({
        data: {
          codeHash,
          expiresAt,
          userId: userExists.userId,
        },
      });
    }

    this.mail.forgotPasswordMail(credentials.email, verificationCode);

    return {
      status: 200,
      message: genericMessage,
    };
  }
}
