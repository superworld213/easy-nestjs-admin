import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 1))
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value ?? 10))
  @IsNumber()
  page_size?: number = 10;

  @IsOptional()
  @IsString()
  order_by?: string;

  @IsOptional()
  @IsString()
  order_by_direction?: 'asc' | 'desc';

  [key: string]: unknown;
}
