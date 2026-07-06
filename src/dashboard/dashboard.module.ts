import { Module } from '@nestjs/common';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './repositories/dashboard.repository';

import { ShopModule } from '../shop/shop.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [ShopModule, CommonModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}
