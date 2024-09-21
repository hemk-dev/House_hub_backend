import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  IsDecimal,
} from 'class-validator';
import { BHKStatus } from 'src/shared/enums/bhk-type.enum';
import { FurnishingStatus } from 'src/shared/enums/furnishing-status.enum';
import { AvailabilityStatus } from 'src/shared/enums/property-availability-status.enum';
import { PropertyStatus } from 'src/shared/enums/property-status.enum';

export class RegisterPropertyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsEnum(AvailabilityStatus)
  availability_status: AvailabilityStatus;

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

  @IsEnum(PropertyStatus)
  @IsNotEmpty()
  status: PropertyStatus;

  @IsEnum(FurnishingStatus)
  @IsNotEmpty()
  furnishing: FurnishingStatus;

  @IsArray()
  @IsOptional()
  photos?: string[];

  @IsEnum(BHKStatus)
  @IsNotEmpty()
  BHK: BHKStatus;

  @IsNumber()
  @IsOptional()
  age_of_construction?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
