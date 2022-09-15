import { SignupDto, LoginDto } from './auth.module';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() newUser: SignupDto) {
    return this.authService.signup(newUser);
  }

  @Post('login')
  async login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }
}
