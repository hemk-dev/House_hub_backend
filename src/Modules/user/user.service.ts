// src/user/user.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/User.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserResponse } from 'src/shared/interfaces/createUser.interface';
import { ErrorResponseUtility } from 'src/shared/utils/error-response.utility';
import { CryptoUtility } from 'src/shared/utils/crypto.utility';
import { loginUserDto } from './dto/loginUser.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { passwordResetEmailTemplate } from 'src/shared/email/reset-password-template';
import { MailService } from 'src/shared/utils/mail-service.utility';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { ChangedPasswordEmailTemplate } from 'src/shared/email/password-changed-template';
import { listUserResponse } from 'src/shared/interfaces/listUser.interface';
import { loginUserResponse } from 'src/shared/interfaces/loginUser.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private cryptoUtility: CryptoUtility,
    private mailService: MailService,
  ) {}

  async findAll(): Promise<listUserResponse> {
    try {
      const users = await this.userRepository.find();
      users.map(async (user) => {
        user.email = await this.cryptoUtility.decode(user.email);
        user.phone = await this.cryptoUtility.decode(user.phone);
        delete user.otp;
        delete user.otpUsed;
        delete user.password;
      });
      return { data: users };
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async registerUser(
    createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    try {
      const { fname, lname, email, password, phone, role_id } = createUserDto;

      const encryptedEmail = await this.cryptoUtility.encode(email);
      const encryptedPhone = await this.cryptoUtility.encode(phone);

      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await this.userRepository.findOne({
        where: { email: encryptedEmail },
      });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const user = this.userRepository.create({
        firstName: fname,
        lastName: lname,
        email: encryptedEmail,
        password: hashedPassword,
        phone: encryptedPhone,
        roleId: role_id,
      });

      await this.userRepository.save(user);

      delete user.password;
      delete user.roleId;

      return { user };
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async loginUser(loginUserDto: loginUserDto): Promise<loginUserResponse> {
    try {
      const { email, password } = loginUserDto;
      const encryptedEmail = await this.cryptoUtility.encode(email);

      const user = await this.userRepository.findOne({
        where: { email: encryptedEmail },
      });
      if (!user) {
        throw new NotFoundException('User Not Found');
      }
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (!verifyPassword) {
        throw new UnauthorizedException('Invalid credentials!');
      }
      const payload = {
        userId: user.userId,
        fname: user.firstName,
        lname: user.lastName,
        email: email,
        roleId: user.roleId,
      };
      const token = await this.jwtService.signAsync(payload);
      delete user.password;
      delete user.roleId;
      delete user.otp;
      delete user.otpUsed;
      delete user.createdAt;
      delete user.updatedAt;

      return { user, token };
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async forgetPassword(
    forgetPasswordDto: ForgetPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const { email } = forgetPasswordDto;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const encryptedEmail = await this.cryptoUtility.encode(email);
      const user = await this.userRepository.findOne({
        where: { email: encryptedEmail },
      });
      if (!user) {
        throw new NotFoundException('User Not Found');
      }
      user.otp = otp;
      user.otpUsed = false;
      await this.userRepository.save(user);

      const subject = 'Reset Password OTP';
      const html = passwordResetEmailTemplate(otp);

      await this.mailService.sendMail(email, subject, html);
      return {
        message: 'Reset Password OTP sent on ' + forgetPasswordDto.email,
      };
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    try {
      const { email, otp } = verifyOtpDto;
      const encryptedEmail = await this.cryptoUtility.encode(email);
      const user = await this.userRepository.findOne({
        where: { email: encryptedEmail },
      });
      if (!user) {
        throw new NotFoundException('User Not Found');
      }
      if (user.otp !== otp || user.otpUsed === true) {
        throw new UnauthorizedException('Invalid OTP');
      }

      const currentTime = moment();
      const otpCreatedAt = moment(user.updatedAt);
      const diffInMinutes = currentTime.diff(otpCreatedAt, 'minutes');

      if (diffInMinutes > 3) {
        throw new UnauthorizedException('OTP Expired');
      }
      user.otpUsed = true;
      await this.userRepository.save(user);

      return {
        message: 'OTP verified Successfully',
      };
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      const deleteUser = await this.userRepository.delete(id);
      if (deleteUser.affected === 0) {
        throw new NotFoundException('User not found');
      }
      return { message: 'User deleted successfully' };
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async updatePassword(
    resetPasswordDto: loginUserDto,
  ): Promise<{ message: string }> {
    try {
      const { email, password } = resetPasswordDto;
      const encryptedEmail = await this.cryptoUtility.encode(email);

      const user = await this.userRepository.findOne({
        where: { email: encryptedEmail },
      });

      if (!user) {
        throw new NotFoundException('User Not Found');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;

      await this.userRepository.save(user);

      const subject = 'Your Password Has Been Changed';
      const timeOfChange = new Date().toLocaleString();
      const html = ChangedPasswordEmailTemplate(timeOfChange, user.firstName);

      await this.mailService.sendMail(email, subject, html);

      return { message: 'Password updated successfully' };
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }
}
