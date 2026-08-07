import { Injectable } from '@nestjs/common';
import { MenuCategory, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MenuCategoryCreateInput): Promise<MenuCategory> {
    return this.prisma.menuCategory.create({
      data,
    });
  }

  async findAllByShop(shopId: string): Promise<MenuCategory[]> {
    return this.prisma.menuCategory.findMany({
      where: {
        shopId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findById(id: string): Promise<MenuCategory | null> {
    return this.prisma.menuCategory.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.MenuCategoryUpdateInput,
  ): Promise<MenuCategory> {
    return this.prisma.menuCategory.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string): Promise<MenuCategory> {
    return this.prisma.menuCategory.delete({
      where: {
        id,
      },
    });
  }

  async findByName(shopId: string, name: string) {
    return this.prisma.menuCategory.findFirst({
      where: {
        shopId,
        name,
      },
    });
  }

  async findByIdAndShop(id: string, shopId: string) {
    return this.prisma.menuCategory.findFirst({
      where: {
        id,
        shopId,
      },
    });
  }

  // ----------------------------------------------------------
  // Check whether category contains menu items
  // ----------------------------------------------------------
  async countMenuItems(categoryId: string): Promise<number> {
    return this.prisma.menuItem.count({
      where: {
        categoryId,
      },
    });
  }
}
