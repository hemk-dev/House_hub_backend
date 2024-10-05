import { IsOptional, IsString } from 'class-validator';

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
  availabilityStatus?: number;

  @IsOptional()
  status?: number;

  @IsOptional()
  furnishing?: number;

  @IsOptional()
  BHK?: number;

  @IsOptional()
  minRent?: number;

  @IsOptional()
  maxRent?: number;

  @IsOptional()
  minDeposit?: number;

  @IsOptional()
  maxDeposit?: number;

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

  @IsOptional()
  @IsString()
  keyword?: string;
}
