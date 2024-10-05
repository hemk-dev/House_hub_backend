import { IsString, IsNumber, IsOptional, IsInt } from 'class-validator';

export class UpdatePropertyDto {
  @IsInt()
  @IsOptional()
  availability_status?: number;

  @IsNumber()
  @IsOptional()
  security_deposit?: number;

  @IsNumber()
  @IsOptional()
  rent?: number;

  @IsString()
  @IsOptional()
  contact: string;

  @IsOptional()
  @IsInt()
  status: number;

  @IsOptional()
  @IsInt()
  furnishing: number;

  @IsNumber()
  @IsOptional()
  age_of_construction?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
