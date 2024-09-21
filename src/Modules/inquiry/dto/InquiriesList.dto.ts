import { IsOptional, IsString, IsEnum, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { InquiryStatus } from 'src/shared/enums/inquiry-status.enum';

export class InquiriesListDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsEnum(InquiryStatus)
  status?: InquiryStatus;

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
