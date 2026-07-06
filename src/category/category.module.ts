import { Module } from '@nestjs/common';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repositories/category.repository';

import { ShopModule } from '../shop/shop.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [ShopModule, CommonModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryModule {}
