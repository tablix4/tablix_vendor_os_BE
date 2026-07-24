import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { DashboardDateRange } from '../types/dashboard-date-range.type';

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

  async totalOrders(shopId: string, dateRange?: DashboardDateRange) {
    return this.prisma.order.count({
      where: {
        shopId,

        ...(dateRange && {
          createdAt: {
            gte: dateRange.startDate,
            lt: dateRange.endDate,
          },
        }),
      },
    });
  }

  async statusCount(
    shopId: string,
    status: OrderStatus,
    dateRange?: DashboardDateRange,
  ) {
    return this.prisma.order.count({
      where: {
        shopId,
        status,

        ...(dateRange && {
          createdAt: {
            gte: dateRange.startDate,
            lt: dateRange.endDate,
          },
        }),
      },
    });
  }

  async totalSales(shopId: string, dateRange?: DashboardDateRange) {
    const result = await this.prisma.order.aggregate({
      where: {
        shopId,
        status: OrderStatus.COMPLETED,

        ...(dateRange && {
          createdAt: {
            gte: dateRange.startDate,
            lt: dateRange.endDate,
          },
        }),
      },

      _sum: {
        total: true,
      },
    });

    return Number(result._sum.total ?? 0);
  }

  async recentOrders(shopId: string, dateRange?: DashboardDateRange) {
    return this.prisma.order.findMany({
      where: {
        shopId,

        ...(dateRange && {
          createdAt: {
            gte: dateRange.startDate,
            lt: dateRange.endDate,
          },
        }),
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
