import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { getOtpEmailTemplate } from './templates/otp-email.template';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  async sendOtp(email: string, otp: string): Promise<void> {
    try {
      console.log('Sending OTP via Brevo API:', email);

      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: {
            name: this.configService.get<string>('MAIL_FROM_NAME'),
            email: this.configService.get<string>('MAIL_FROM'),
          },
          to: [
            {
              email,
            },
          ],
          subject: `${otp} is your Vendor OS verification code`,
          htmlContent: getOtpEmailTemplate(otp),
        },
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': this.configService.get<string>('BREVO_API_KEY'),
          },
        },
      );

      console.log('Brevo Response:', response.data);
      console.log('OTP email sent successfully');
    } catch (error: any) {
      console.error('Brevo API Error:', error.response?.data || error.message);

      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
