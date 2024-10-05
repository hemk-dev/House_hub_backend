import { IsOptional, IsString, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class InquiriesListDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  status?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  created_at?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updated_date?: Date;

  @IsOptional()
  @IsUUID()
  property_id?: string;
}
