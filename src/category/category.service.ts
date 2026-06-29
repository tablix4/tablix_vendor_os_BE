import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ShopRepository } from '../shop/repositories/shop.repository';
import { CategoryRepository } from './repositories/category.repository';

import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly shopRepository: ShopRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createCategory(ownerId: string, dto: CreateCategoryDto) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const existingCategory = await this.categoryRepository.findByName(
      shop.id,
      dto.name,
    );

    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }

    const category = await this.categoryRepository.create({
      name: dto.name,
      shop: {
        connect: {
          id: shop.id,
        },
      },
    });

    return {
      success: true,
      message: 'Category created successfully',
      data: category,
    };
  }

  async getCategories(ownerId: string) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const categories = await this.categoryRepository.findAllByShop(shop.id);

    return {
      success: true,
      data: categories,
    };
  }

  async getCategoryById(ownerId: string, categoryId: string) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const category = await this.categoryRepository.findById(categoryId);

    if (!category || category.shopId !== shop.id) {
      throw new NotFoundException('Category not found');
    }

    return {
      success: true,
      data: category,
    };
  }

  async updateCategory(
    ownerId: string,
    categoryId: string,
    dto: UpdateCategoryDto,
  ) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const category = await this.categoryRepository.findById(categoryId);

    if (!category || category.shopId !== shop.id) {
      throw new NotFoundException('Category not found');
    }

    const updated = await this.categoryRepository.update(category.id, {
      name: dto.name,
    });

    return {
      success: true,
      message: 'Category updated successfully',
      data: updated,
    };
  }

  async deleteCategory(ownerId: string, categoryId: string) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const category = await this.categoryRepository.findById(categoryId);

    if (!category || category.shopId !== shop.id) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.delete(category.id);

    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }
}
