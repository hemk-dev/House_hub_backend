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
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { Property } from 'src/shared/entities/Property.entity';
import { UserRole } from 'src/shared/enums/user-roles.enum';
import { Roles } from '../user/decorators/roles.decorator';
import { RegisterPropertyDto } from './dto/registerProperty.dto';
import { RegisterPropertyInterface } from 'src/shared/interfaces/registerProperty.interface';
import { UpdatePropertyDto } from './dto/updateProperty.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import { RolesGuard } from '../user/guards/roles.guard';
import { ListPropertiesDto } from './dto/ListProperties.dto';

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

  //for website property details page
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BUYER, UserRole.OWNER)
  @Get(':id')
  async getPropertyById(@Param('id') id: string): Promise<Property> {
    return this.propertiesService.getPropertyById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @Get('owner')
  async getPropertyByOwner(@Request() request: any): Promise<Property[]> {
    return this.propertiesService.getPropertyByOwner(request.user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @Post('register')
  async createProperty(
    @Body() registerPropertyDto: RegisterPropertyDto,
    @Request() request: any,
  ): Promise<RegisterPropertyInterface> {
    console.log('Register', request.user);
    return this.propertiesService.registerProperty(
      registerPropertyDto,
      request.user,
    );
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
