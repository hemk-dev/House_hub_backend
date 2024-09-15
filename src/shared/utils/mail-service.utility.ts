import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Set up your nodemailer transport (Gmail, SMTP, etc.)
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // You can use any other email service
      auth: {
        user: process.env.MAIL_USER, // your email
        pass: process.env.MAIL_PASSWORD, // your email password or app password if using Gmail
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      html,
    };
    console.log(process.env.MAIL_USER, process.env.MAIL_PASSWORD);
    console.log('🚀 ~ MailService ~ sendMail ~ mailOptions:', mailOptions);

    return await this.transporter.sendMail(mailOptions);
  }
}
