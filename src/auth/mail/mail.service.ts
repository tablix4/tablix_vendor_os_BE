import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

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
        from: `"Vendor OS" <${this.configService.get('SMTP_USER')}>`,
        to: email,
        subject: 'Your Login OTP',
        html: this.getOtpTemplate(otp),
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  private getOtpTemplate(otp: string): string {
    return `
      <div style="font-family:Arial;padding:30px">
        <h2>Vendor OS Login</h2>

        <p>Your OTP is</p>

        <h1
          style="
            letter-spacing:8px;
            color:#2563eb;
          "
        >
          ${otp}
        </h1>

        <p>This OTP is valid for 5 minutes.</p>

        <br>

        <small>
          If you didn't request this OTP,
          please ignore this email.
        </small>
      </div>
    `;
  }
}
