import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BHKStatus } from 'src/shared/enums/bhk-type.enum';
import { FurnishingStatus } from 'src/shared/enums/furnishing-status.enum';
import { AvailabilityStatus } from 'src/shared/enums/property-availability-status.enum';
import { PropertyStatus } from 'src/shared/enums/property-status.enum';

export class ListPropertiesDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  owner_name?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsEnum(AvailabilityStatus)
  availabilityStatus?: AvailabilityStatus;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsOptional()
  @IsEnum(FurnishingStatus)
  furnishing?: FurnishingStatus;

  @IsOptional()
  @IsEnum(BHKStatus)
  BHK?: BHKStatus;

  @IsOptional()
  minRent?: number;

  @IsOptional()
  maxRent?: number;

  @IsOptional()
  minSecurityDeposit?: number;

  @IsOptional()
  maxSecurityDeposit?: number;

  @IsOptional()
  minCarpetArea?: number;

  @IsOptional()
  maxCarpetArea?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
