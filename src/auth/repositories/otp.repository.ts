import { Injectable } from '@nestjs/common';
import { Otp, OtpPurpose, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OtpRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.OtpCreateInput): Promise<Otp> {
    return this.prisma.otp.create({
      data,
    });
  }

  async deletePrevious(email: string, purpose: OtpPurpose): Promise<void> {
    await this.prisma.otp.deleteMany({
      where: {
        email,
        purpose,
      },
    });
  }

  async findLatest(email: string, purpose: OtpPurpose): Promise<Otp | null> {
    return this.prisma.otp.findFirst({
      where: {
        email,
        purpose,
        isUsed: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findValidOtp(
    email: string,
    otp: string,
    purpose: OtpPurpose,
  ): Promise<Otp | null> {
    return this.prisma.otp.findFirst({
      where: {
        email,
        otp,
        purpose,
        isUsed: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsUsed(id: string): Promise<Otp> {
    return this.prisma.otp.update({
      where: {
        id,
      },
      data: {
        isUsed: true,
      },
    });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.otp.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
