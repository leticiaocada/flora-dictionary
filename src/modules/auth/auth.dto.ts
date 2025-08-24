import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}

export class SignInUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
