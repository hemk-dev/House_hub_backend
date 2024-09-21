import { IsString, IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateInquiryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  contact: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsUUID()
  @IsNotEmpty()
  property_id: string;
}
