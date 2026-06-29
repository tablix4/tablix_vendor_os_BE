import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async totalMenuItems(shopId: string) {
    return this.prisma.menuItem.count({
      where: {
        shopId,
      },
    });
  }

  async totalCategories(shopId: string) {
    return this.prisma.menuCategory.count({
      where: {
        shopId,
      },
    });
  }

  async totalOrders(shopId: string) {
    return this.prisma.order.count({
      where: {
        shopId,
      },
    });
  }

  async statusCount(shopId: string, status: OrderStatus) {
    return this.prisma.order.count({
      where: {
        shopId,
        status,
      },
    });
  }

  async totalSales(shopId: string) {
    const result = await this.prisma.order.aggregate({
      where: {
        shopId,
        status: OrderStatus.COMPLETED,
      },
      _sum: {
        total: true,
      },
    });

    return Number(result._sum.total ?? 0);
  }

  async recentOrders(shopId: string) {
    return this.prisma.order.findMany({
      where: {
        shopId,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  }
}
