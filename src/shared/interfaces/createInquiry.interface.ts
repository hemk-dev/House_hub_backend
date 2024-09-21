import { Inquiry } from '../entities/Inquiry.entity';

export interface createInquiryInterface {
  inquiry: Inquiry;
  message: string;
}
