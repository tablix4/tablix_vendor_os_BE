import { BadRequestException, Injectable } from '@nestjs/common';

import { OrderStatus } from '@prisma/client';

import { DashboardRepository } from './repositories/dashboard.repository';
import { DashboardDateRange } from './types/dashboard-date-range.type';

import { ShopHelperService } from '../common/services/shop-helper.service';
import { ApiResponse } from '../common/utils/api-response';
import { Messages } from '../common/constants/messages';

@Injectable()
export class DashboardService {
  constructor(
    private readonly shopHelperService: ShopHelperService,
    private readonly dashboardRepository: DashboardRepository,
  ) {}

  async getDashboard(ownerId: string, startDate?: string, endDate?: string) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const dateRange = this.getDateRange(startDate, endDate);

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

      this.dashboardRepository.totalOrders(shop.id, dateRange),

      this.dashboardRepository.statusCount(
        shop.id,
        OrderStatus.PENDING,
        dateRange,
      ),

      this.dashboardRepository.statusCount(
        shop.id,
        OrderStatus.PREPARING,
        dateRange,
      ),

      this.dashboardRepository.statusCount(
        shop.id,
        OrderStatus.READY,
        dateRange,
      ),

      this.dashboardRepository.statusCount(
        shop.id,
        OrderStatus.COMPLETED,
        dateRange,
      ),

      this.dashboardRepository.totalSales(shop.id, dateRange),

      this.dashboardRepository.recentOrders(shop.id, dateRange),
    ]);

    return ApiResponse.success(Messages.DASHBOARD_FETCH_SUCCESS, {
      startDate: startDate ?? null,
      endDate: endDate ?? null,

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

  private getDateRange(
    startDate?: string,
    endDate?: string,
  ): DashboardDateRange | undefined {
    // No filters = all-time dashboard
    if (!startDate && !endDate) {
      return undefined;
    }

    // Require both dates
    if (!startDate || !endDate) {
      throw new BadRequestException('Both startDate and endDate are required');
    }

    const start = new Date(`${startDate}T00:00:00.000Z`);

    const end = new Date(`${endDate}T00:00:00.000Z`);

    if (start > end) {
      throw new BadRequestException('startDate cannot be greater than endDate');
    }

    // Make end date inclusive by moving to next day.
    end.setUTCDate(end.getUTCDate() + 1);

    return {
      startDate: start,
      endDate: end,
    };
  }
}
