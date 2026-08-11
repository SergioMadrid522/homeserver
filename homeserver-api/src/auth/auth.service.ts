import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './DTO/sign-up.dto';
import { comparePassword, hashPassword } from 'src/utils/password.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { capitalizeFirstletter } from 'src/utils/capitalize-first-letter';
import { LoginDto } from './DTO/login.dto';
import { Request, Response } from 'express';
import { setAuthCookie } from 'src/setCookie/set-session-cookie';
import { signJwt, verifyJwt } from 'src/setCookie/jwt';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './DTO/forgot-password.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { VerifyResetCodeDto } from './DTO/verify-reset-code.dto';
import { ResetPasswordDto } from './DTO/reset-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';

@Injectable()
export class AuthService {
  private tempToken!: string;
  private baseDisk;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private mail: MailService,
  ) {
    this.baseDisk = process.env.DISK_PATH;

    if (!this.baseDisk) {
      throw new Error('La variable DISK_PATH no esta definida');
    }
  }

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

  private generateResetPasswordToken(email: string) {
    const payload = { email };
    return this.jwtService.sign(payload, {
      secret: process.env.RESET_PASSWORD_SECRET,
      expiresIn: '5m',
    });
  }

  private generateEmailVerificationToken(email: string) {
    const payload = { email };
    return this.jwtService.sign(payload, {
      secret: process.env.EMAIL_VERIFICATION_SECRET,
      expiresIn: '24h',
    });
  }

  private checkToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      return { expired: false, payload };
    } catch (error: any) {
      return { expired: true, message: error.message };
    }
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

    const userStorageId = uuidv4();

    const createdUser = await this.prisma.user.create({
      data: {
        name: capitalizeFirstletter(name),
        lastname: capitalizeFirstletter(lastname),
        email,
        passwordHash,
        userStorageId,
      },
      select: {
        userId: true,
        name: true,
        lastname: true,
        email: true,
        createdAt: true,
      },
    });

    const verificationToken = this.generateEmailVerificationToken(email);

    const tokenHash = await bcrypt.hash(verificationToken, 10);

    // add 24 hours to the current time
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.emailVerification.create({
      data: {
        tokenHash,
        expiresAt,
        user: { connect: { userId: createdUser.userId } },
      },
    });

    const linkToVerifyEmail = `${process.env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(verificationToken)}`;

    this.mail.welcomeEmail(createdUser, linkToVerifyEmail);

    return {
      url: `http://192.168.0.21:3001/auth/verify-email?token=${encodeURIComponent(verificationToken)}`,
      message: 'Cuenta creada exitosamente. Por favor checa tu email.',
    };
  }

  async logout(res: Response, req: Request) {
    const token = req.cookies?.sessionCookie;

    if (!token) {
      throw new UnauthorizedException('No hay una sesión activa.');
    }

    const payload = await verifyJwt(token);

    if (!payload) {
      throw new UnauthorizedException('Sesión inválida o expirada.');
    }
    if (typeof payload.email !== 'string') {
      throw new UnauthorizedException('El token no contiene un correo válido.');
    }
    const email = payload.email;
    const lastLogin = new Date();

    await this.prisma.user.update({
      where: { email },
      data: { lastLogin },
    });

    res.clearCookie('sessionCookie');
    return {
      message: 'Se ha cerrado sesión con éxito.',
    };
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
        data: { codeHash, attempts: { increment: 1 } },
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
      verificationCode,
      message: genericMessage,
    };
  }

  async verifyResetCode(body: VerifyResetCodeDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
      select: {
        userId: true,
        email: true,
      },
    });

    const code = await this.prisma.recoverPassword.findFirst({
      where: { userId: user?.userId },
    });

    if (!code) {
      throw new NotFoundException(
        'Esta cuenta no tiene ningún codigo asociado',
      );
    }

    if (code?.isUsed) {
      await this.prisma.recoverPassword.deleteMany({
        where: { userId: user?.userId },
      });

      throw new ConflictException('Este codigo ya ha sido usado');
    }

    const isMatch = await bcrypt.compare(body.resetCode, code?.codeHash!);

    if (!isMatch) {
      throw new ConflictException('Código incorrecto.');
    }

    const currentDate = new Date();

    if (code.expiresAt < currentDate) {
      await this.prisma.recoverPassword.deleteMany({
        where: { userId: user?.userId },
      });
      throw new NotFoundException(
        'Este código ya caduco, genere un nuevo código',
      );
    }

    this.tempToken = this.generateResetPasswordToken(user?.email!);

    await this.prisma.recoverPassword.deleteMany({
      where: { userId: user?.userId },
    });

    return {
      status: 200,
    };
  }

  async verifyEmail(token: string) {
    let payload: { email?: string };

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.EMAIL_VERIFICATION_SECRET,
      });
    } catch {
      throw new BadRequestException(
        'El enlace de verificación es inválido o ha expirado.',
      );
    }

    if (typeof payload.email !== 'string') {
      throw new BadRequestException('El token no contiene un correo válido.');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      select: {
        userId: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new NotFoundException('No se encontró la cuenta.');
    }

    if (user.emailVerified) {
      throw new ConflictException('Este correo ya fue verificado.');
    }

    const validation = await this.prisma.emailVerification.findFirst({
      where: { userId: user.userId },
      orderBy: { verificationId: 'desc' },
      include: { user: { select: { userStorageId: true } } },
    });

    if (!validation) {
      throw new NotFoundException(
        'Esta cuenta no tiene un token de verificación asociado.',
      );
    }

    if (validation.isUsed) {
      throw new ConflictException('Este token ya fue utilizado.');
    }

    const expiresAt = new Date();

    if (validation.expiresAt < expiresAt) {
      throw new BadRequestException('Este enlace de verificación ha expirado.');
    }

    const isMatch = await bcrypt.compare(token, validation.tokenHash);

    if (!isMatch) {
      throw new BadRequestException('Token inválido.');
    }

    const targetDirectory = path.join(
      this.baseDisk,
      validation.user.userStorageId,
    );

    try {
      await fs.mkdir(targetDirectory);

      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { userId: user.userId },
          data: { emailVerified: true },
        }),

        this.prisma.emailVerification.update({
          where: { verificationId: validation.verificationId },
          data: { isUsed: true },
        }),
      ]);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al crear la carpeta del usuario.');
    }

    return {
      message: 'Email verificado, ya puede iniciar sesión.',
    };
  }

  async resetPassword(credentials: ResetPasswordDto) {
    if (credentials.newPassword !== credentials.validateNewPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    if (
      credentials.newPassword.length < 8 ||
      credentials.validateNewPassword.length < 8
    ) {
      throw new BadRequestException('La contraseña es muy corta.');
    }

    const passwordHash = await hashPassword(credentials.newPassword);

    const isTokenValid = this.checkToken(this.tempToken);

    if (isTokenValid.expired) {
      throw new NotFoundException('Por favor genere un código nuevo.');
    }

    await this.prisma.user.update({
      where: { email: credentials.email },
      data: { passwordHash },
    });

    this.mail.resetPasswordMail(credentials.email);

    return {
      message: 'La contraseña se ha cambiado con éxito.',
    };
  }
}
