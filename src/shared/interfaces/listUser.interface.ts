import { User } from '../entities/User.entity';

export interface listUserResponse {
  data: Omit<User, 'password' | 'otp' | 'otp_used'>[];
}
