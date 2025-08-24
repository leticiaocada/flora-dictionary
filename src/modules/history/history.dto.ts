import { IsString, IsDate } from 'class-validator';

export class HistoryDto {
  @IsString()
  user_id: string;

  @IsString()
  word: string;

  @IsDate()
  added: Date;
}
