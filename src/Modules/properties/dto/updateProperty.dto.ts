import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  IsDecimal,
} from 'class-validator';
import { FurnishingStatus } from 'src/shared/enums/furnishing-status.enum';
import { AvailabilityStatus } from 'src/shared/enums/property-availability-status.enum';
import { PropertyStatus } from 'src/shared/enums/property-status.enum';

export class UpdatePropertyDto {
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

  @IsEnum(PropertyStatus)
  @IsNotEmpty()
  status: PropertyStatus;

  @IsEnum(FurnishingStatus)
  @IsNotEmpty()
  furnishing: FurnishingStatus;

  @IsArray()
  @IsOptional()
  photos?: string[];

  @IsNumber()
  @IsOptional()
  age_of_construction?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
