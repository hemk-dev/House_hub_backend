import { Module } from '@nestjs/common';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiry } from 'src/shared/entities/Inquiry.entity';
import { PropertiesModule } from '../properties/properties.module';
import { CryptoUtility } from 'src/shared/utils/crypto.utility';
import { MailService } from 'src/shared/utils/mail-service.utility';
import { Property } from 'src/shared/entities/Property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry, Property]), PropertiesModule],
  controllers: [InquiryController],
  providers: [InquiryService, CryptoUtility, MailService],
})
export class InquiryModule {}
