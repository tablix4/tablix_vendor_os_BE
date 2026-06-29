import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { ShopRepository } from '../shop/repositories/shop.repository';
import { CategoryRepository } from '../category/repositories/category.repository';
import { MenuRepository } from './repositories/menu.repository';

import { CreateMenuItemDto, UpdateMenuItemDto } from './dto';

@Injectable()
export class MenuService {
  constructor(
    private readonly shopRepository: ShopRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly menuRepository: MenuRepository,
  ) {}

  async createMenuItem(ownerId: string, dto: CreateMenuItemDto) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const category = await this.categoryRepository.findByIdAndShop(
      dto.categoryId,
      shop.id,
    );

    if (!category) {
      throw new BadRequestException('Invalid category');
    }

    const menuItem = await this.menuRepository.create({
      name: dto.name,
      description: dto.description,
      price: new Prisma.Decimal(dto.price),
      image: dto.image,
      isAvailable: dto.isAvailable ?? true,

      shop: {
        connect: {
          id: shop.id,
        },
      },

      category: {
        connect: {
          id: category.id,
        },
      },
    });

    return {
      success: true,
      message: 'Menu item created successfully',
      data: menuItem,
    };
  }

  async getMenuItems(ownerId: string) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const menuItems = await this.menuRepository.findAllByShop(shop.id);

    return {
      success: true,
      data: menuItems,
    };
  }

  async getMenuItemById(ownerId: string, menuItemId: string) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const menuItem = await this.menuRepository.findByIdAndShop(
      menuItemId,
      shop.id,
    );

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return {
      success: true,
      data: menuItem,
    };
  }

  async updateMenuItem(
    ownerId: string,
    menuItemId: string,
    dto: UpdateMenuItemDto,
  ) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const menuItem = await this.menuRepository.findByIdAndShop(
      menuItemId,
      shop.id,
    );

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    const updateData: Prisma.MenuItemUpdateInput = {
      name: dto.name,
      description: dto.description,
      image: dto.image,
      isAvailable: dto.isAvailable,
    };

    if (dto.price !== undefined) {
      updateData.price = new Prisma.Decimal(dto.price);
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findByIdAndShop(
        dto.categoryId,
        shop.id,
      );

      if (!category) {
        throw new BadRequestException('Invalid category');
      }

      updateData.category = {
        connect: {
          id: category.id,
        },
      };
    }

    const updated = await this.menuRepository.update(menuItem.id, updateData);

    return {
      success: true,
      message: 'Menu item updated successfully',
      data: updated,
    };
  }

  async deleteMenuItem(ownerId: string, menuItemId: string) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const menuItem = await this.menuRepository.findByIdAndShop(
      menuItemId,
      shop.id,
    );

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    await this.menuRepository.delete(menuItem.id);

    return {
      success: true,
      message: 'Menu item deleted successfully',
    };
  }

  async toggleAvailability(ownerId: string, menuItemId: string) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const menuItem = await this.menuRepository.findByIdAndShop(
      menuItemId,
      shop.id,
    );

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    const updated = await this.menuRepository.update(menuItem.id, {
      isAvailable: !menuItem.isAvailable,
    });

    return {
      success: true,
      message: 'Availability updated',
      data: updated,
    };
  }
}
