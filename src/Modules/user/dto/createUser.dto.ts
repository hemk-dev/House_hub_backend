import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsNumber,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  fname: string;

  @IsString()
  @MinLength(3)
  lname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  role_id: number;

  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
    },
  )
  password: string;

  @Matches(/^[6-9]\d{9}$/, {
    message: 'Phone number must be a valid 10-digit number.',
  })
  phone: string;
}
