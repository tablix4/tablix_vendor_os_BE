import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Order } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({
      data,
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }

  async findAllByShop(shopId: string) {
    return this.prisma.order.findMany({
      where: {
        shopId,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: Prisma.OrderUpdateInput['status']) {
    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}
