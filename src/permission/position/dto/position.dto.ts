import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  name: string;

  @IsNumber()
  dept_id: number;
}

export class UpdatePositionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  dept_id?: number;
}

export class SetDataPermissionDto {
  @IsString()
  policy_type: string;

  @IsOptional()
  value?: any;
}
