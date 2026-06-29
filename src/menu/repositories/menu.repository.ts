import { Injectable } from '@nestjs/common';
import { MenuItem, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MenuRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MenuItemCreateInput): Promise<MenuItem> {
    return this.prisma.menuItem.create({
      data,
    });
  }

  async findAllByShop(shopId: string): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({
      where: {
        shopId,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<MenuItem | null> {
    return this.prisma.menuItem.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.MenuItemUpdateInput,
  ): Promise<MenuItem> {
    return this.prisma.menuItem.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string): Promise<MenuItem> {
    return this.prisma.menuItem.delete({
      where: {
        id,
      },
    });
  }

  async findByIdAndShop(id: string, shopId: string): Promise<MenuItem | null> {
    return this.prisma.menuItem.findFirst({
      where: {
        id,
        shopId,
      },
      include: {
        category: true,
      },
    });
  }

  async findManyByIds(shopId: string, ids: string[]) {
    return this.prisma.menuItem.findMany({
      where: {
        shopId,
        id: {
          in: ids,
        },
        isAvailable: true,
      },
    });
  }
}
