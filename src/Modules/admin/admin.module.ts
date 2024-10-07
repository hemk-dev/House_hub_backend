import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/shared/entities/User.entity';
import { Property } from 'src/shared/entities/Property.entity';
import { Transasctions } from 'src/shared/entities/Transasctions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Property, Transasctions])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
