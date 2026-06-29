import { Module } from '@nestjs/common';

import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuRepository } from './repositories/menu.repository';

import { ShopModule } from '../shop/shop.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [ShopModule, CategoryModule],
  controllers: [MenuController],
  providers: [MenuService, MenuRepository],
  exports: [MenuRepository],
})
export class MenuModule {}
