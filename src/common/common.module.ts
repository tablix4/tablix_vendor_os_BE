import { Module } from '@nestjs/common';

import { ShopModule } from '../shop/shop.module';

import { ShopHelperService } from './services/shop-helper.service';

@Module({
  imports: [ShopModule],
  providers: [ShopHelperService],
  exports: [ShopHelperService],
})
export class CommonModule {}
