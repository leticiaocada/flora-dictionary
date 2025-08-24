import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, SignInUserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async createUser(@Body() createUser: CreateUserDto) {
    return this.authService.createUser(createUser);
  }

  @Post('signin')
  async signIn(@Body() signInUser: SignInUserDto) {
    return this.authService.signIn(signInUser);
  }
}
