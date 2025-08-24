import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @Transform(({ value }) => !!value)
  @IsOptional()
  @IsBoolean()
  isPrevious?: boolean;
}

export class GetWordsDTO extends PaginationDTO {
  @IsOptional()
  @IsString()
  search: string;
}
