import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { ShopRepository } from '../shop/repositories/shop.repository';
import { MenuRepository } from '../menu/repositories/menu.repository';
import { OrderRepository } from './repositories/order.repository';

import { CreateOrderDto, UpdateOrderStatusDto } from './dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly shopRepository: ShopRepository,
    private readonly menuRepository: MenuRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async createOrder(ownerId: string, dto: CreateOrderDto) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const menuIds = dto.items.map((item) => item.menuItemId);

    const menuItems = await this.menuRepository.findManyByIds(shop.id, menuIds);

    if (menuItems.length !== dto.items.length) {
      throw new BadRequestException(
        'One or more menu items are invalid or unavailable.',
      );
    }

    let total = 0;

    const orderItems = dto.items.map((item) => {
      const menu = menuItems.find((m) => m.id === item.menuItemId);

      if (!menu) {
        throw new BadRequestException('Invalid menu item.');
      }

      total += Number(menu.price) * item.quantity;

      return {
        quantity: item.quantity,
        price: menu.price,
        menuItem: {
          connect: {
            id: menu.id,
          },
        },
      };
    });

    const order = await this.orderRepository.create({
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      total: new Prisma.Decimal(total),

      shop: {
        connect: {
          id: shop.id,
        },
      },

      items: {
        create: orderItems,
      },
    });

    return {
      success: true,
      message: 'Order created successfully',
      data: order,
    };
  }

  async getOrders(ownerId: string) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const orders = await this.orderRepository.findAllByShop(shop.id);

    return {
      success: true,
      data: orders,
    };
  }

  async getOrderById(ownerId: string, orderId: string) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order || order.shopId !== shop.id) {
      throw new NotFoundException('Order not found');
    }

    return {
      success: true,
      data: order,
    };
  }

  async updateOrderStatus(
    ownerId: string,
    orderId: string,
    dto: UpdateOrderStatusDto,
  ) {
    const shop = await this.shopRepository.findByOwnerId(ownerId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order || order.shopId !== shop.id) {
      throw new NotFoundException('Order not found');
    }

    const updated = await this.orderRepository.updateStatus(
      order.id,
      dto.status,
    );

    return {
      success: true,
      message: 'Order status updated successfully',
      data: updated,
    };
  }
}
