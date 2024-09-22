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

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    private cryptoUtility: CryptoUtility,
  ) {}

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

      if (listPropertiesFilter?.minSecurityDeposit) {
        query.andWhere('property.security_deposit >= :minSecurityDeposit', {
          minSecurityDeposit: listPropertiesFilter?.minSecurityDeposit,
        });
      }

      if (listPropertiesFilter?.maxSecurityDeposit) {
        query.andWhere('property.security_deposit <= :maxSecurityDeposit', {
          maxSecurityDeposit: listPropertiesFilter?.maxSecurityDeposit,
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
      return property;
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async registerProperty(
    registerPropertyDto: RegisterPropertyDto,
    user: any,
  ): Promise<RegisterPropertyInterface> {
    try {
      const encryptedEmail = await this.cryptoUtility.encode(user.email);
      const property = this.propertyRepository.create({
        ...registerPropertyDto,
        userId: user.userId,
        email: encryptedEmail,
        owner_name: user.fname + ' ' + user.lname,
      });
      await this.propertyRepository.save(property);
      return {
        property: property,
        message: 'Property Registered successfully ',
      };
    } catch (error) {
      console.log('error', error);
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }

  async getPropertyByOwner(user: User): Promise<Property[]> {
    try {
      const encryptedEmail = await this.cryptoUtility.encode(user.email);
      const properties = await this.propertyRepository.find({
        where: [{ email: encryptedEmail }, { userId: user.userId }],
      });
      if (!properties) {
        throw new NotFoundException('Property Not Found');
      }
      return properties;
    } catch (error) {
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

      const updatedProperty = {
        ...property,
        ...(updatePropertyDto.availability_status && {
          availability_status: updatePropertyDto.availability_status,
        }),
        ...(updatePropertyDto.security_deposit && {
          security_deposit: updatePropertyDto.security_deposit,
        }),
        ...(updatePropertyDto.rent && { rent: updatePropertyDto.rent }),
        ...(updatePropertyDto.contact && {
          contact: updatePropertyDto.contact,
        }),
        ...(updatePropertyDto.status && { status: updatePropertyDto.status }),
        ...(updatePropertyDto.furnishing && {
          furnishing: updatePropertyDto.furnishing,
        }),
        ...(updatePropertyDto.photos && { photos: updatePropertyDto.photos }),
        ...(updatePropertyDto.age_of_construction && {
          age_of_construction: updatePropertyDto.age_of_construction,
        }),
        ...(updatePropertyDto.description && {
          description: updatePropertyDto.description,
        }),
      };

      await this.propertyRepository.save(updatedProperty);

      return { message: 'Property Deleted Successfully' };
    } catch (error) {
      ErrorResponseUtility.handleApiResponseError(error);
    }
  }
}
