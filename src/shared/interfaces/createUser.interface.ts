import { User } from '../entities/User.entity';

export interface CreateUserResponse {
  user: Omit<User, 'password' | 'roleId'>;
}
