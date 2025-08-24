import { IsEmail, IsString } from 'class-validator';

export class userTokenDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;
}
