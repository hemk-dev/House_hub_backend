import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { Property } from 'src/shared/entities/Property.entity';
import { CryptoUtility } from 'src/shared/utils/crypto.utility';
import { UserModule } from '../user/user.module';
import { CloudinaryService } from 'src/shared/utils/cloudinary.utility';
import { Transasctions } from 'src/shared/entities/Transasctions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, Transasctions]), UserModule],
  controllers: [PropertiesController],
  providers: [PropertiesService, CryptoUtility, CloudinaryService],
})
export class PropertiesModule {}
