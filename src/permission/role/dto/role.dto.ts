import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsNumber()
  @IsOptional()
  sort?: number;

  @IsString()
  @IsOptional()
  remark?: string;
}

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsNumber()
  @IsOptional()
  sort?: number;

  @IsString()
  @IsOptional()
  remark?: string;
}

export class SetMenusDto {
  @IsArray()
  menuIds: number[];
}
