import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateUserResponse } from 'src/shared/interfaces/createUser.interface';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { loginUserDto } from './dto/loginUser.dto';
import { RolesGuard } from './Guards/roles.guard';
import { UserRole } from 'src/shared/enums/user-roles.enum';
import { Roles } from './decorators/roles.decorator';
import { listUserResponse } from 'src/shared/interfaces/listUser.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async getUsers(): Promise<listUserResponse> {
    return this.userService.findAll();
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    return this.userService.registerUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: loginUserDto): Promise<CreateUserResponse> {
    return this.userService.loginUser(loginUserDto);
  }

  @Post('forget-password')
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.forgetPassword(forgetPasswordDto);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<{ message: string }> {
    return this.userService.verifyOtp(verifyOtpDto);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: loginUserDto,
  ): Promise<{ message: string }> {
    return this.userService.updatePassword(resetPasswordDto);
  }
}
