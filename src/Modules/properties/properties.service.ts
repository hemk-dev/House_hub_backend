import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from 'src/shared/entities/Property.entity';
import { ErrorResponseUtility } from 'src/shared/utils/error-response.utility';
import { Repository } from 'typeorm';
import { RegisterPropertyDto } from './dto/registerProperty.dto';
import { RegisterPropertyInterface } from 'src/shared/interfaces/registerProperty.interface';
import { CryptoUtility } from 'src/shared/utils/crypto.utility';
import { User } from 'src/shared/entities/User.entity';
import { UpdatePropertyDto } from './dto/updateProperty.dto';
import { ListPropertiesDto } from './dto/ListProperties.dto';
import { UserRole } from 'src/shared/enums/user-roles.enum';
import Stripe from 'stripe';
import { PropertyStatus } from 'src/shared/enums/property-status.enum';
import { Transasctions } from 'src/shared/entities/Transasctions.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Transasctions)
    private paymentsRepository: Repository<Transasctions>,
    private cryptoUtility: CryptoUtility,
  ) {}

  stripe = new Stripe(process.env.STRIPE_SECRET!, {
    apiVersion: '2022-11-15' as Stripe.LatestApiVersion,
  });

  async bookProperty(propertyId: string, user: any): Promise<any> {
    try {
      const { fname, lname } = user;
      const property: any = await this.propertyRepository.findOne({
        where: { id: propertyId },
      });

      if (!property) {
        throw new NotFoundException('Property not found!');
      }

      const deposit = parseFloat(property.security_deposit);
      const rent = parseFloat(property.rent);
      const totalAmount = (deposit + rent) * 100;

      const lineItems = [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Booking for Property: ${property.name}`,
              description: 'Rent and Security Deposit',
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ];

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });

      const transaction = new Transasctions();
      transaction.property_id = property.id;
      transaction.amount = totalAmount;
      transaction.paymentIntentId = session.id;
      transaction.owner_name = property.owner_name;
      transaction.buyer_name = `${fname} ${lname}`;
      property.status = PropertyStatus.OCCUPIED;

      await this.paymentsRepository.save(transaction);

      return {
        success: true,
        sessionId: session.id,
      };
    } catch (error) {
      console.error('Error while booking property:', error);
      return { success: false };
    }
  }

  async getAllTransactions(): Promise<any> {
    try {
      const transactions = await this.paymentsRepository.find();
      return transactions;
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async getFilters(): Promise<any> {
    try {
      const query = this.propertyRepository.createQueryBuilder('property');

      const ownerName = await query
        .distinct(true)
        .select('property.owner_name')
        .getRawMany();
      const city = await query
        .distinct(true)
        .select('property.city')
        .getRawMany();
      const state = await query
        .distinct(true)
        .select('property.state')
        .getRawMany();
      const country = await query
        .distinct(true)
        .select('property.country')
        .getRawMany();

      const filters = {
        owner_name: ownerName.map((o) => o.property_owner_name),
        city: city.map((c) => c.property_city),
        state: state.map((s) => s.property_state),
        country: country.map((s) => s.property_country),
      };

      return filters;
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async listProperties(
    listPropertiesFilter: ListPropertiesDto,
  ): Promise<Property[]> {
    try {
      const query = this.propertyRepository.createQueryBuilder('property');

      if (listPropertiesFilter?.keyword) {
        query.andWhere(
          'property.property_name ilike :keyword OR property.city ilike :keyword OR property.state ilike :keyword',
          { keyword: listPropertiesFilter?.keyword.toLowerCase() },
        );
      }

      if (listPropertiesFilter?.city) {
        query.andWhere('property.city ilike :city', {
          city: listPropertiesFilter?.city.toLowerCase(),
        });
      }

      if (listPropertiesFilter?.owner_name) {
        query.andWhere('property.owner_name ilike :owner', {
          owner: listPropertiesFilter?.owner_name.toLowerCase(),
        });
      }

      if (listPropertiesFilter?.state) {
        query.andWhere('property.state ilike :state', {
          state: listPropertiesFilter?.state.toLowerCase(),
        });
      }

      if (listPropertiesFilter?.country) {
        query.andWhere('property.country ilike :country', {
          country: listPropertiesFilter?.country.toLowerCase(),
        });
      }

      if (listPropertiesFilter?.availabilityStatus) {
        query.andWhere('property.availability_status = :availabilityStatus', {
          availabilityStatus: listPropertiesFilter?.availabilityStatus,
        });
      }

      if (listPropertiesFilter?.status) {
        query.andWhere('property.status = :status', {
          status: listPropertiesFilter?.status,
        });
      }

      if (listPropertiesFilter?.furnishing) {
        query.andWhere('property.furnishing = :furnishing', {
          furnishing: listPropertiesFilter?.furnishing,
        });
      }

      if (listPropertiesFilter?.BHK) {
        query.andWhere('property.BHK = :BHK', {
          BHK: listPropertiesFilter?.BHK,
        });
      }

      if (listPropertiesFilter?.minRent) {
        query.andWhere('property.rent >= :minRent', {
          minRent: listPropertiesFilter?.minRent,
        });
      }

      if (listPropertiesFilter?.maxRent) {
        query.andWhere('property.rent <= :maxRent', {
          maxRent: listPropertiesFilter?.maxRent,
        });
      }

      if (listPropertiesFilter?.minDeposit) {
        query.andWhere('property.security_deposit >= :minSecurityDeposit', {
          minSecurityDeposit: listPropertiesFilter?.minDeposit,
        });
      }

      if (listPropertiesFilter?.maxDeposit) {
        query.andWhere('property.security_deposit <= :maxSecurityDeposit', {
          maxSecurityDeposit: listPropertiesFilter?.maxDeposit,
        });
      }

      if (listPropertiesFilter?.minCarpetArea) {
        query.andWhere('property.carpet_area >= :minCarpetArea', {
          minCarpetArea: listPropertiesFilter?.minCarpetArea,
        });
      }

      if (listPropertiesFilter?.maxCarpetArea) {
        query.andWhere('property.carpet_area <= :maxCarpetArea', {
          maxCarpetArea: listPropertiesFilter?.maxCarpetArea,
        });
      }

      if (listPropertiesFilter?.sortBy) {
        query.orderBy(
          `property.${listPropertiesFilter?.sortBy}`,
          listPropertiesFilter?.sortOrder || 'ASC',
        );
      }

      const properties = await query.getMany();
      if (properties.length === 0) {
        throw new NotFoundException('No properties found!');
      }
      return properties;
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async getPropertyById(id: string): Promise<Property> {
    try {
      const property = await this.propertyRepository.findOne({
        where: { id },
      });
      if (!property) {
        throw new NotFoundException('Property not found!');
      }
      return property;
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async registerProperty(
    registerPropertyDto: RegisterPropertyDto,
    user: any,
    imageFilenames: string[], // Accept array of image filenames
  ): Promise<RegisterPropertyInterface> {
    try {
      const encryptedEmail = await this.cryptoUtility.encode(user.email);
      const property = this.propertyRepository.create({
        ...registerPropertyDto,
        userId: user.userId,
        email: encryptedEmail,
        owner_name: `${user.fname} ${user.lname}`,
        photos: imageFilenames, // Store array of image filenames in 'photos'
      });
      await this.propertyRepository.save(property);
      return {
        property: property,
        message: 'Property Registered successfully',
      };
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async getPropertyByOwner(userID: string): Promise<any> {
    try {
      const properties = await this.propertyRepository.find({
        where: { userId: userID },
      });
      if (properties.length === 0) {
        throw new NotFoundException('Property Not found');
      }
      console.log('11111111', properties);
      return properties;
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async getPropertyDashboard(user: User): Promise<Property[]> {
    try {
      let properties: Property[];
      if (user.roleId === UserRole.OWNER) {
        const encryptedEmail = await this.cryptoUtility.encode(user.email);
        properties = await this.propertyRepository.find({
          where: [{ email: encryptedEmail }, { userId: user.userId }],
        });
      } else {
        properties = await this.propertyRepository.find();
      }

      if (!properties || properties.length === 0) {
        throw new NotFoundException('Properties Not Found');
      }

      return properties;
    } catch (error) {
      console.log(error);
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async deleteProperty(id: string): Promise<{ message: string }> {
    try {
      const property = await this.propertyRepository.find({
        where: { id },
      });

      if (!property) {
        throw new NotFoundException('Property Not Found');
      }
      await this.propertyRepository.remove(property);
      return { message: 'Property Deleted Successfully' };
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async updateProperty(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<{ message: string }> {
    try {
      const property = await this.propertyRepository.findOne({ where: { id } });

      if (!property) {
        throw new NotFoundException('Property Not Found');
      }

      // Update only fields that are provided in updatePropertyDto
      const updatedProperty = {
        ...property,
        ...(updatePropertyDto.availability_status !== undefined && {
          availability_status: updatePropertyDto.availability_status,
        }),
        ...(updatePropertyDto.security_deposit !== undefined && {
          security_deposit: updatePropertyDto.security_deposit,
        }),
        ...(updatePropertyDto.rent !== undefined && {
          rent: updatePropertyDto.rent,
        }),
        ...(updatePropertyDto.contact !== undefined && {
          contact: updatePropertyDto.contact,
        }),
        ...(updatePropertyDto.status !== undefined && {
          status: updatePropertyDto.status,
        }),
        ...(updatePropertyDto.furnishing !== undefined && {
          furnishing: updatePropertyDto.furnishing,
        }),
        ...(updatePropertyDto.age_of_construction !== undefined && {
          age_of_construction: updatePropertyDto.age_of_construction,
        }),
        ...(updatePropertyDto.description && {
          description: updatePropertyDto.description,
        }),
      };

      console.log(updatedProperty);
      await this.propertyRepository.save(updatedProperty);
      return { message: 'Property Updated Successfully' };
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }
}
