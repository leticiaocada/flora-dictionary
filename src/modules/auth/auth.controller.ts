import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, signInUserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  createUser(@Body() createUser: CreateUserDto) {
    return this.authService.createUser(createUser);
  }

  @Post('signin')
  signIn(@Body() signInUser: signInUserDto) {
    return this.authService.signIn(signInUser);
  }
}
