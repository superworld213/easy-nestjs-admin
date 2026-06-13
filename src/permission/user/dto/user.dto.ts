import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsString()
  @IsOptional()
  remark?: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsString()
  @IsOptional()
  remark?: string;
}

export class SetRolesDto {
  @IsArray()
  roleIds: number[];
}
