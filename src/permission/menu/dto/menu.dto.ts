import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateMenuDto {
  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  component?: string;

  @IsString()
  @IsOptional()
  redirect?: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsOptional()
  meta?: Record<string, any>;

  @IsNumber()
  @IsOptional()
  sort?: number;

  @IsString()
  @IsOptional()
  remark?: string;
}

export class UpdateMenuDto {
  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  component?: string;

  @IsString()
  @IsOptional()
  redirect?: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsOptional()
  meta?: Record<string, any>;

  @IsNumber()
  @IsOptional()
  sort?: number;

  @IsString()
  @IsOptional()
  remark?: string;
}
