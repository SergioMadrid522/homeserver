import { ConflictException, Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { CreatedUser } from 'src/types/user.types';
import { welcomeTemplate } from './templates/welcome-template';
import { forgotPasswordTemplate } from './templates/reset-password-template';

@Injectable()
export class MailService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  async welcomeEmail(user: CreatedUser) {
    const { error } = await this.resend.emails.send({
      from: 'AM Cloud Server <onboarding@resend.dev>',
      to: ['sergioac.madrid@hotmail.com'] /* user.email */,
      subject: `Welcome to AM CLOUD SERVER, ${user.name}!`,
      /* react: WelcomeEmail(user), */
      html: welcomeTemplate(user),
    });

    if (error) {
      throw new ConflictException('No se pudo enviar el correo.');
    }
  }

  async forgotPasswordMail(email: string, verificationCode: string) {
    const { error } = await this.resend.emails.send({
      from: 'AM Cloud Server <onboarding@resend.dev>',
      to: ['sergioac.madrid@hotmail.com'] /* user.email */,
      subject: `Solicitud de recuperación de contraseña`,
      html: forgotPasswordTemplate(verificationCode),
    });

    if (error) {
      throw new ConflictException('No se pudo enviar el correo.');
    }
  }
}
