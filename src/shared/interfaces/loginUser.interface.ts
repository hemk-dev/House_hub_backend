import { User } from '../entities/User.entity';

export interface loginUserResponse {
  user: Omit<User, 'password' | 'roleId'>;
  token: string;
}
