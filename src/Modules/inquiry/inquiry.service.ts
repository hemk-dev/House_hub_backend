import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry } from 'src/shared/entities/Inquiry.entity';
import { CryptoUtility } from 'src/shared/utils/crypto.utility';
import { Repository } from 'typeorm';
import { InquiriesListDto } from './dto/InquiriesList.dto';
import { ErrorResponseUtility } from 'src/shared/utils/error-response.utility';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { createInquiryInterface } from 'src/shared/interfaces/createInquiry.interface';
import { Property } from 'src/shared/entities/Property.entity';
import { MailService } from 'src/shared/utils/mail-service.utility';
import { newInquiryEmailTempalteForBuyer } from 'src/shared/email/newInquiryEmailTempalteForBuyer';
import { newInquiryEmailTemplateForOwner } from 'src/shared/email/newInquiryEmailTempalteForOwner';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private InquiryRepository: Repository<Inquiry>,
    @InjectRepository(Property)
    private PropertyRepository: Repository<Property>,
    private cryptoUtility: CryptoUtility,
    private mailService: MailService,
  ) {}

  async listInquiries(InquiryFilter: InquiriesListDto): Promise<any[]> {
    try {
      const query = this.InquiryRepository.createQueryBuilder('inquiry')
        .leftJoinAndSelect('inquiry.property', 'property') // Join the property
        .select([
          'inquiry', // Select all fields from inquiry
          'property.name AS propertyName', // Select the property name
        ]);

      if (InquiryFilter?.status) {
        query.andWhere('inquiry.status = :status', {
          status: InquiryFilter?.status,
        });
      }

      if (InquiryFilter?.property_id) {
        query.andWhere('inquiry.property_id = :id', {
          id: InquiryFilter?.property_id,
        });
      }

      if (InquiryFilter?.created_at) {
        query.andWhere('inquiry.created_at = :date', {
          date: InquiryFilter?.created_at,
        });
      }

      const inquiries = await query.getRawMany(); // Use getRawMany to access selected fields directly

      // Decode sensitive information
      const decodedInquiries = await Promise.all(
        inquiries.map(async (inquiry) => {
          const decodedInquiry = {
            ...inquiry,
            inquiry_email: await this.cryptoUtility.decode(
              inquiry.inquiry_email,
            ),
            inquiry_contact: await this.cryptoUtility.decode(
              inquiry.inquiry_contact,
            ),
          };
          return decodedInquiry;
        }),
      );

      return decodedInquiries;
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async createInquiry(
    createInquiryDto: CreateInquiryDto,
  ): Promise<createInquiryInterface> {
    try {
      const { email, contact } = createInquiryDto;
      const property = await this.PropertyRepository.findOne({
        where: {
          id: createInquiryDto?.property_id,
        },
      });

      if (!property) {
        throw new NotFoundException('Property Not Found!');
      }
      const encryptedEmail = await this.cryptoUtility.encode(email);
      const encryptedContact = await this.cryptoUtility.encode(contact);

      const newInquiry = this.InquiryRepository.create({
        ...createInquiryDto,
        email: encryptedEmail,
        contact: encryptedContact,
      });

      const subjectBuyer = `Your Inquiry for ${property.name} Has Been Submitted`;
      const htmlBuyer = newInquiryEmailTempalteForBuyer(
        property.name,
        property.owner_name,
      );

      const subjectOwner = `New Inquiry for Your Property: ${property.name}`;
      const htmlOwner = newInquiryEmailTemplateForOwner(
        createInquiryDto.name,
        email,
        contact,
        property.name,
      );
      const ownerEmail = await this.cryptoUtility.decode(property.email);
      await this.mailService.sendMail(email, subjectBuyer, htmlBuyer);
      await this.mailService.sendMail(ownerEmail, subjectOwner, htmlOwner);

      const inquiry = await this.InquiryRepository.save(newInquiry);

      return {
        inquiry: inquiry,
        message: 'Property Registered successfully ',
      };
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async updateInquiryStatus(inquiry_id: string): Promise<{ message: string }> {
    try {
      const inquiry = await this.InquiryRepository.findOneBy({ inquiry_id });

      if (!inquiry) {
        throw new Error('Inquiry not found');
      }

      inquiry.status = true;
      await this.InquiryRepository.save(inquiry);
      return { message: 'Inquiry Status Updated!' };
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }
}
