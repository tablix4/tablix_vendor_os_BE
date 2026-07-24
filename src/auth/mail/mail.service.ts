import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { getOtpEmailTemplate } from './templates/otp-email.template';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: Number(this.configService.get<string>('SMTP_PORT')),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Vendor OS" <${this.configService.get<string>('SMTP_USER')}>`,
        to: email,
        subject: `${otp} is your Vendor OS verification code`,
        html: getOtpEmailTemplate(otp),
      });
    } catch (error) {
      console.error('Failed to send Vendor OS OTP email:', error);

      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
