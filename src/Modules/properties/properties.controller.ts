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
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.BUYER, UserRole.OWNER)
  @UseGuards(AuthGuard, RolesGuard)
  async getPropertyById(@Param('id') id: string): Promise<Property> {
    return await this.propertiesService.getPropertyById(id);
  }

  @Post('register')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // Define your upload directory
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
    }),
  )
  async createProperty(
    @Body() registerPropertyDto: RegisterPropertyDto,
    @UploadedFile() image: Express.Multer.File,
    @Request() request: any,
  ): Promise<RegisterPropertyInterface> {
    return this.propertiesService.registerProperty(
      registerPropertyDto,
      request.user,
      image?.filename,
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
