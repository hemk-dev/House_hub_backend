import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class RegisterPropertyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  // @IsInt()
  @IsNotEmpty()
  availability_status: number;

  @IsNotEmpty()
  security_deposit: number;

  @IsNotEmpty()
  rent: number;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  zipcode: string;

  @IsOptional()
  carpet_area?: number;

  @IsNotEmpty()
  status: number;

  @IsNotEmpty()
  furnishing: number;

  @IsArray()
  @IsOptional()
  photos?: string[];

  @IsNotEmpty()
  BHK: number;

  @IsOptional()
  age_of_construction?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
