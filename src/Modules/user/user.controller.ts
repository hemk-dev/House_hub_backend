import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateUserResponse } from 'src/shared/interfaces/createUser.interface';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { loginUserDto } from './dto/loginUser.dto';
import { listUserResponse } from 'src/shared/interfaces/listUser.interface';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { UserRole } from 'src/shared/enums/user-roles.enum';
import { Roles } from './decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.OWNER)
  // @Get('status')
  // status(@Request() request) {
  //   console.log('Inside AuthController status method', request.user);
  //   return 'req.user';
  // }

  @UseGuards(AuthGuard, RolesGuard)
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

  @Put('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: loginUserDto,
  ): Promise<{ message: string }> {
    return this.userService.updatePassword(resetPasswordDto);
  }
}
