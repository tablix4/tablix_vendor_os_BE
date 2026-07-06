import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

import { DashboardRepository } from './repositories/dashboard.repository';

import { ShopHelperService } from '../common/services/shop-helper.service';
import { ApiResponse } from '../common/utils/api-response';
import { Messages } from '../common/constants/messages';

@Injectable()
export class DashboardService {
  constructor(
    private readonly shopHelperService: ShopHelperService,
    private readonly dashboardRepository: DashboardRepository,
  ) {}

  async getDashboard(ownerId: string) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

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

    return ApiResponse.success(Messages.DASHBOARD_FETCH_SUCCESS, {
      totalSales,
      totalOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      totalMenuItems,
      totalCategories,
      recentOrders,
    });
  }
}
