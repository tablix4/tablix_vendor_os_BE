import { Injectable, NotFoundException } from '@nestjs/common';

import { ShopRepository } from './repositories/shop.repository';
import { UpdateShopDto } from './dto';

@Injectable()
export class ShopService {
  constructor(private readonly shopRepository: ShopRepository) {}

  async getMyShop(ownerId: string) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return {
      success: true,
      data: shop,
    };
  }

  async updateShop(ownerId: string, dto: UpdateShopDto) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const updatedShop = await this.shopRepository.update(shop.id, {
      name: dto.name,
      logo: dto.logo,
    });

    return {
      success: true,
      message: 'Shop updated successfully',
      data: updatedShop,
    };
  }
}
