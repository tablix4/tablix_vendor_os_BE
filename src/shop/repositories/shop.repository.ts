import { Injectable } from '@nestjs/common';
import { Prisma, Shop } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ShopRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByOwnerId(ownerId: string): Promise<Shop | null> {
    return this.prisma.shop.findUnique({
      where: {
        ownerId,
      },
    });
  }

  async update(id: string, data: Prisma.ShopUpdateInput): Promise<Shop> {
    return this.prisma.shop.update({
      where: {
        id,
      },
      data,
    });
  }
  async updateName(shopId: string, name: string) {
    return this.prisma.shop.update({
      where: {
        id: shopId,
      },
      data: {
        name,
      },
    });
  }
}
