import { Injectable, NotFoundException } from '@nestjs/common';

import { ShopRepository } from './repositories/shop.repository';

import { UpdateShopDto } from './dto';

import { ApiResponse } from '../common/utils/api-response';
import { Messages } from '../common/constants/messages';

@Injectable()
export class ShopService {
  constructor(private readonly shopRepository: ShopRepository) {}

  async getMyShop(ownerId: string) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException(Messages.SHOP_NOT_FOUND);
    }

    return ApiResponse.success(Messages.SHOP_FETCH_SUCCESS, shop);
  }

  async updateShop(ownerId: string, dto: UpdateShopDto) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException(Messages.SHOP_NOT_FOUND);
    }

    const updatedShop = await this.shopRepository.update(shop.id, {
      name: dto.name,
      logo: dto.logo,
    });

    return ApiResponse.success(Messages.SHOP_UPDATED, updatedShop);
  }
}
