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

      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,

      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP VERIFY ERROR');
        console.error(error);
      } else {
        console.log('SMTP SERVER READY');
      }
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    try {
      console.log('Sending OTP email todddd:', email);
      console.log({
        host: this.configService.get('SMTP_HOST'),
        port: this.configService.get('SMTP_PORT'),
        user: this.configService.get('SMTP_USER'),
        hasPassword: !!this.configService.get('SMTP_PASSWORD'),
      });
      await this.transporter.sendMail({
        from: `"Vendor OS" <${this.configService.get<string>('SMTP_USER')}>`,
        to: email,
        subject: `${otp} is your Vendor OS verification code`,
        html: getOtpEmailTemplate(otp),
      });
      console.log('OTP email sent successfully to:', email);
    } catch (error) {
      console.error('Failed to send Vendor OS OTP email:', error);

      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
