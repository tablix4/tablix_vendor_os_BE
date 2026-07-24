import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { MenuRepository } from '../menu/repositories/menu.repository';
import { OrderRepository } from './repositories/order.repository';

import { CreateOrderDto, GetOrdersDto, UpdateOrderStatusDto } from './dto';

import { ShopHelperService } from '../common/services/shop-helper.service';
import { ApiResponse } from '../common/utils/api-response';
import { Messages } from '../common/constants/messages';
import { PaginationUtil } from 'src/common/pagination/pagination.util';

@Injectable()
export class OrderService {
  constructor(
    private readonly shopHelperService: ShopHelperService,
    private readonly menuRepository: MenuRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async createOrder(ownerId: string, dto: CreateOrderDto) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const menuIds = dto.items.map((item) => item.menuItemId);

    const menuItems = await this.menuRepository.findManyByIds(shop.id, menuIds);

    if (menuItems.length !== dto.items.length) {
      throw new BadRequestException(Messages.INVALID_MENU_ITEMS);
    }

    let total = 0;

    const orderItems = dto.items.map((item) => {
      const menu = menuItems.find((m) => m.id === item.menuItemId);

      if (!menu) {
        throw new BadRequestException(Messages.INVALID_MENU_ITEM);
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

    return ApiResponse.success(Messages.ORDER_CREATED, order);
  }

  async getOrders(ownerId: string, query: GetOrdersDto) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const result = await this.orderRepository.findAllByShopWithPagination(
      shop.id,
      {
        skip: PaginationUtil.getSkip(query.page, query.limit),
        take: query.limit,
        search: query.customerName,
        customerPhone: query.customerPhone,
        status: query.status,
        fromDate: query.fromDate ? new Date(query.fromDate) : undefined,
        toDate: query.toDate ? new Date(query.toDate) : undefined,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      },
    );

    return ApiResponse.success(
      Messages.ORDER_FETCH_SUCCESS,
      PaginationUtil.createResponse(
        result.items,
        result.total,
        query.page,
        query.limit,
      ),
    );
  }

  async getOrderById(ownerId: string, orderId: string) {
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const order = await this.orderRepository.findById(orderId);

    if (!order || order.shopId !== shop.id) {
      throw new NotFoundException(Messages.ORDER_NOT_FOUND);
    }

    return ApiResponse.success(Messages.ORDER_DETAILS, order);
  }

  async updateOrderStatus(
    ownerId: string,
    orderId: string,
    dto: UpdateOrderStatusDto,
  ) {
    console.log('Updating order status:', { ownerId, orderId, dto });
    const shop = await this.shopHelperService.getCurrentShop(ownerId);

    const order = await this.orderRepository.findById(orderId);

    if (!order || order.shopId !== shop.id) {
      throw new NotFoundException(Messages.ORDER_NOT_FOUND);
    }

    const updated = await this.orderRepository.updateStatus(
      order.id,
      dto.status as any, // Type assertion to Prisma.OrderStatus
    );

    return ApiResponse.success(Messages.ORDER_UPDATED, updated);
  }
}
