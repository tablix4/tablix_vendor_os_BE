import { Module } from '@nestjs/common';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './repositories/order.repository';

import { ShopModule } from '../shop/shop.module';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [ShopModule, MenuModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
