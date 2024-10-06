import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { Property } from 'src/shared/entities/Property.entity';
import { UserRole } from 'src/shared/enums/user-roles.enum';
import { Roles } from '../user/decorators/roles.decorator';
import { UpdatePropertyDto } from './dto/updateProperty.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import { RolesGuard } from '../user/guards/roles.guard';
import { ListPropertiesDto } from './dto/ListProperties.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RegisterPropertyDto } from './dto/registerProperty.dto';
import { uploadImageToCloudinary } from 'src/shared/cloudinary/cloudinary';

@Controller('properties')
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.BUYER, UserRole.OWNER)
  @Get()
  async getProperties(
    @Query() listPropertiesFilters: ListPropertiesDto,
  ): Promise<Property[]> {
    return this.propertiesService.listProperties(listPropertiesFilters);
  }

  @Get('list')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getPropertyDashboard(@Request() request: any): Promise<any> {
    return this.propertiesService.getPropertyDashboard(request.user);
  }

  @Get('owner/:userID')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getPropertyByOwner(@Param('userID') userID: string): Promise<any> {
    console.log('getPropertyByOwner', userID);
    return this.propertiesService.getPropertyByOwner(userID);
  }

  @Get('filters')
  async getPropertiesFilters(): Promise<any> {
    return this.propertiesService.getFilters();
  }

  @Get('transactions')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getPaymentTransactions(): Promise<any> {
    return this.propertiesService.getAllTransactions();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.BUYER, UserRole.OWNER)
  @UseGuards(AuthGuard, RolesGuard)
  async getPropertyById(@Param('id') id: string): Promise<Property> {
    return await this.propertiesService.getPropertyById(id);
  }

  @Post('register')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UseInterceptors(FilesInterceptor('photos', 5))
  async createProperty(
    @Body() registerPropertyDto: RegisterPropertyDto,
    @UploadedFiles() photos: Express.Multer.File[],
    @Request() request: any,
  ): Promise<any> {
    const uploadPromises = photos.map((file) =>
      uploadImageToCloudinary(file, { folder: 'property_images' }),
    );
    const uploadResults = await Promise.all(uploadPromises);
    const photoUrls = uploadResults.map((result) => result.secure_url); // Use secure_url for rendering

    return this.propertiesService.registerProperty(
      registerPropertyDto,
      request.user,
      photoUrls, // Pass Cloudinary URLs instead of filenames
    );
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BUYER)
  @Post('book')
  async bookProperty(
    @Body() body: { propertyId: string },
    @Request() request: any,
  ): Promise<any> {
    const result = await this.propertiesService.bookProperty(
      body.propertyId,
      request.user,
    );
    return result;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @Delete(':id')
  async deleteProperty(@Param('id') id: string): Promise<{ message: string }> {
    return this.propertiesService.deleteProperty(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @Put(':id')
  async updateProperty(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): Promise<{ message: string }> {
    return this.propertiesService.updateProperty(id, updatePropertyDto);
  }
}
