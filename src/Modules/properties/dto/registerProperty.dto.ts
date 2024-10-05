import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsDecimal,
  IsInt,
} from 'class-validator';

export class RegisterPropertyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsInt()
  availability_status: number;

  @IsDecimal()
  @IsNotEmpty()
  security_deposit: number;

  @IsDecimal()
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

  @IsDecimal()
  @IsOptional()
  carpet_area?: number;

  @IsNotEmpty()
  @IsInt()
  status: number;

  @IsNotEmpty()
  @IsInt()
  furnishing: number;

  @IsArray()
  @IsOptional()
  photos?: string[];

  @IsNotEmpty()
  @IsInt()
  BHK: number;

  @IsNumber()
  @IsOptional()
  age_of_construction?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
