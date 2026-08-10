import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { request } from 'express';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { verifyJwt } from 'src/setCookie/jwt';

@Injectable()
export class LoggerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request?.cookies?.sessionCookie;

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

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { userId: true },
    });

    if (!user) {
      throw new ForbiddenException('No existe una cuenta con ese email.');
    }
    request['user'] = user;

    return true;
  }
}
