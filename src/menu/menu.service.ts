import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { CategoryRepository } from '../category/repositories/category.repository';
import { MenuRepository } from './repositories/menu.repository';

import { CreateMenuItemDto, GetMenuItemsDto, UpdateMenuItemDto } from './dto';

import { ShopHelperService } from '../common/services/shop-helper.service';
import { ApiResponse } from '../common/utils/api-response';
import { Messages } from '../common/constants/messages';
import { PaginationUtil } from 'src/common/pagination/pagination.util';

@Injectable()
export class MenuService {
  constructor(
    private readonly shopHelperService: ShopHelperService,
    private readonly categoryRepository: CategoryRepository,
    private readonly menuRepository: MenuRepository,
  ) {}

  async createMenuItem(ownerId: string, dto: CreateMenuItemDto) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const category = await this.categoryRepository.findByIdAndShop(
      dto.categoryId,
      shop.id,
    );

    if (!category) {
      throw new BadRequestException(Messages.INVALID_CATEGORY);
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

    return ApiResponse.success(Messages.MENU_ITEM_CREATED, menuItem);
  }

  async getMenuItems(ownerId: string, query: GetMenuItemsDto) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const result = await this.menuRepository.findAllByShopWithPagination(
      shop.id,
      {
        skip: PaginationUtil.getSkip(query.page, query.limit),
        take: query.limit,
        search: query.search,
        categoryId: query.categoryId,
        isAvailable: query.isAvailable,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      },
    );

    return ApiResponse.success(
      Messages.MENU_FETCH_SUCCESS,
      PaginationUtil.createResponse(
        result.items,
        result.total,
        query.page,
        query.limit,
      ),
    );
  }

  async getMenuItemById(ownerId: string, menuItemId: string) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const menuItem = await this.menuRepository.findByIdAndShop(
      menuItemId,
      shop.id,
    );

    if (!menuItem) {
      throw new NotFoundException(Messages.MENU_ITEM_NOT_FOUND);
    }

    return ApiResponse.success(Messages.MENU_DETAILS, menuItem);
  }

  async updateMenuItem(
    ownerId: string,
    menuItemId: string,
    dto: UpdateMenuItemDto,
  ) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const menuItem = await this.menuRepository.findByIdAndShop(
      menuItemId,
      shop.id,
    );

    if (!menuItem) {
      throw new NotFoundException(Messages.MENU_ITEM_NOT_FOUND);
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
        throw new BadRequestException(Messages.INVALID_CATEGORY);
      }

      updateData.category = {
        connect: {
          id: category.id,
        },
      };
    }

    const updated = await this.menuRepository.update(menuItem.id, updateData);

    return ApiResponse.success(Messages.MENU_UPDATED, updated);
  }

  async deleteMenuItem(ownerId: string, menuItemId: string) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const menuItem = await this.menuRepository.findByIdAndShop(
      menuItemId,
      shop.id,
    );

    if (!menuItem) {
      throw new NotFoundException(Messages.MENU_ITEM_NOT_FOUND);
    }

    console.log(menuItem);
    await this.menuRepository.delete(menuItem.id);

    return ApiResponse.success(Messages.MENU_DELETED);
  }

  async toggleAvailability(ownerId: string, menuItemId: string) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const menuItem = await this.menuRepository.findByIdAndShop(
      menuItemId,
      shop.id,
    );

    if (!menuItem) {
      throw new NotFoundException(Messages.MENU_ITEM_NOT_FOUND);
    }

    const updated = await this.menuRepository.update(menuItem.id, {
      isAvailable: !menuItem.isAvailable,
    });

    return ApiResponse.success(Messages.MENU_AVAILABILITY_UPDATED, updated);
  }
}
