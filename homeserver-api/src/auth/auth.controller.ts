import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './DTO/sign-up.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  login() {
    return 'hola';
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
