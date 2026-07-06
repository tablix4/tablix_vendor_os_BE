import { Injectable, NotFoundException } from '@nestjs/common';

import { Shop } from '@prisma/client';

import { ShopRepository } from '../../shop/repositories/shop.repository';

@Injectable()
export class ShopHelperService {
  constructor(private readonly shopRepository: ShopRepository) {}

  async getCurrentShop(ownerId: string): Promise<Shop> {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return shop;
  }
}
