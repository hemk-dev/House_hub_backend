import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { AuthGuard } from '../user/guards/auth.guard';
import { RolesGuard } from '../user/guards/roles.guard';
import { UserRole } from 'src/shared/enums/user-roles.enum';
import { Roles } from '../user/decorators/roles.decorator';
import { InquiriesListDto } from './dto/InquiriesList.dto';
import { Inquiry } from 'src/shared/entities/Inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { createInquiryInterface } from 'src/shared/interfaces/createInquiry.interface';

@Controller('inquiry')
export class InquiryController {
  constructor(private inquiryService: InquiryService) {}
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BUYER, UserRole.OWNER)
  @Get('list')
  async getProperties(
    @Query() inquiriesListDto: InquiriesListDto,
  ): Promise<Inquiry[]> {
    return this.inquiryService.listInquiries(inquiriesListDto);
  }

  @Post('new-inquiry')
  async createInquiry(
    @Body() createInquiryDto: CreateInquiryDto,
  ): Promise<createInquiryInterface> {
    return this.inquiryService.createInquiry(createInquiryDto);
  }

  @Patch('status/:inquiry_id')
  async updateInquiryStatus(
    @Param('inquiry_id') inquiry_id: string,
  ): Promise<{ message: string }> {
    return this.inquiryService.updateInquiryStatus(inquiry_id);
  }
}
