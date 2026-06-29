import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  /**
   * Generate a random 6-digit OTP
   */
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * OTP Expiry (5 Minutes)
   */
  getExpiryTime(): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5);
    return expiry;
  }

  /**
   * Check OTP Expiry
   */
  isExpired(expiry: Date): boolean {
    return expiry.getTime() < Date.now();
  }

  /**
   * Compare OTP
   */
  verifyOtp(storedOtp: string, enteredOtp: string): boolean {
    return storedOtp === enteredOtp;
  }
}
