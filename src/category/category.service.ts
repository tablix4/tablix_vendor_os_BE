import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CategoryRepository } from './repositories/category.repository';

import { CreateCategoryDto, UpdateCategoryDto } from './dto';

import { ShopHelperService } from '../common/services/shop-helper.service';
import { ApiResponse } from '../common/utils/api-response';
import { Messages } from '../common/constants/messages';

@Injectable()
export class CategoryService {
  constructor(
    private readonly shopHelperService: ShopHelperService,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createCategory(ownerId: string, dto: CreateCategoryDto) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const existingCategory = await this.categoryRepository.findByName(
      shop.id,
      dto.name,
    );

    if (existingCategory) {
      throw new ConflictException(Messages.CATEGORY_ALREADY_EXISTS);
    }

    const category = await this.categoryRepository.create({
      name: dto.name,
      shop: {
        connect: {
          id: shop.id,
        },
      },
    });

    return ApiResponse.success(Messages.CATEGORY_CREATED, category);
  }

  async getCategories(ownerId: string) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const categories = await this.categoryRepository.findAllByShop(shop.id);

    return ApiResponse.success(Messages.CATEGORY_FETCH_SUCCESS, categories);
  }

  async getCategoryById(ownerId: string, categoryId: string) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const category = await this.categoryRepository.findById(categoryId);

    if (!category || category.shopId !== shop.id) {
      throw new NotFoundException(Messages.CATEGORY_NOT_FOUND);
    }

    return ApiResponse.success(Messages.CATEGORY_DETAILS, category);
  }

  async updateCategory(
    ownerId: string,
    categoryId: string,
    dto: UpdateCategoryDto,
  ) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const category = await this.categoryRepository.findById(categoryId);

    if (!category || category.shopId !== shop.id) {
      throw new NotFoundException(Messages.CATEGORY_NOT_FOUND);
    }

    const updated = await this.categoryRepository.update(category.id, {
      name: dto.name,
    });

    return ApiResponse.success(Messages.CATEGORY_UPDATED, updated);
  }

  async deleteCategory(ownerId: string, categoryId: string) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const category = await this.categoryRepository.findByIdAndShop(
      categoryId,
      shop.id,
    );

    if (!category) {
      throw new NotFoundException(Messages.CATEGORY_NOT_FOUND);
    }

    const menuItemCount = await this.categoryRepository.countMenuItems(
      category.id,
    );

    if (menuItemCount > 0) {
      throw new ConflictException(Messages.CATEGORY_HAS_MENU_ITEMS);
    }

    await this.categoryRepository.delete(category.id);

    return ApiResponse.success(Messages.CATEGORY_DELETED);
  }
}
