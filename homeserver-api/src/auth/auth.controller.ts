import { Body, Controller, Post, Res } from '@nestjs/common';
import { SignUpDto } from './DTO/sign-up.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './DTO/login.dto';
import type { Response } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  @Post('/signup')
  signUp(@Body() user: SignUpDto) {
    return this.authService.createUser(user);
  }

  @Post('/logout')
  logout() {}

  @Post('/forgot-password')
  forgotPassword() {}

  @Post('/reset-password')
  resetPassword() {}
}
