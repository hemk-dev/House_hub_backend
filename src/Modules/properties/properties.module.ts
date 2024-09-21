import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { Property } from 'src/shared/entities/Property.entity';
import { CryptoUtility } from 'src/shared/utils/crypto.utility';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Property]), UserModule],
  controllers: [PropertiesController],
  providers: [PropertiesService, CryptoUtility],
})
export class PropertiesModule {}
