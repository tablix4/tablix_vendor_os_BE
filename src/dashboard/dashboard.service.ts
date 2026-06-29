import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

import { ShopRepository } from '../shop/repositories/shop.repository';
import { DashboardRepository } from './repositories/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly shopRepository: ShopRepository,
    private readonly dashboardRepository: DashboardRepository,
  ) {}

  async getDashboard(ownerId: string) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const [
      totalMenuItems,
      totalCategories,
      totalOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      totalSales,
      recentOrders,
    ] = await Promise.all([
      this.dashboardRepository.totalMenuItems(shop.id),
      this.dashboardRepository.totalCategories(shop.id),
      this.dashboardRepository.totalOrders(shop.id),

      this.dashboardRepository.statusCount(shop.id, OrderStatus.PENDING),

      this.dashboardRepository.statusCount(shop.id, OrderStatus.PREPARING),

      this.dashboardRepository.statusCount(shop.id, OrderStatus.READY),

      this.dashboardRepository.statusCount(shop.id, OrderStatus.COMPLETED),

      this.dashboardRepository.totalSales(shop.id),

      this.dashboardRepository.recentOrders(shop.id),
    ]);

    return {
      success: true,
      data: {
        totalSales,
        totalOrders,
        pendingOrders,
        preparingOrders,
        readyOrders,
        completedOrders,
        totalMenuItems,
        totalCategories,
        recentOrders,
      },
    };
  }
}
