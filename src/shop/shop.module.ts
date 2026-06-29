import { Module } from '@nestjs/common';

import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ShopRepository } from './repositories/shop.repository';

@Module({
  controllers: [ShopController],
  providers: [ShopService, ShopRepository],
  exports: [ShopRepository],
})
export class ShopModule {}
