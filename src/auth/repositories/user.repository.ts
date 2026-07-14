import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        shop: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        shop: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async createUserWithShop(email: string, name: string, shopName: string) {
    return this.prisma.user.create({
      data: {
        email,

        name,

        status: 'ACTIVE',

        shop: {
          create: {
            name: shopName,
          },
        },
      },

      include: {
        shop: true,
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async saveRefreshTokenHash(id: string, refreshTokenHash: string | null) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        refreshTokenHash,
      },
    });
  }

  async clearRefreshToken(id: string) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        refreshTokenHash: null,
      },
    });
  }

  async findProfile(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },

      include: {
        shop: true,
      },
    });
  }
  async updateProfile(id: string, name: string) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }
}
