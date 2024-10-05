import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from 'src/shared/entities/Property.entity';
import { User } from 'src/shared/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async getCounts(): Promise<any> {
    try {
      const totalProperties = await this.propertyRepository.count();

      const totalOwners = await this.userRepository.count({
        where: { roleId: 2 },
      });

      const totalBuyers = await this.userRepository.count({
        where: { roleId: 3 },
      });

      return {
        totalProperties,
        totalOwners,
        totalBuyers,
      };
    } catch (error) {
      throw new Error('Error fetching counts');
    }
  }
}
