import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Order, OrderStatus } from '@prisma/client';

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

  async findAllByShopWithPagination(
    shopId: string,
    query: {
      skip: number;
      take: number;
      search?: string;
      customerPhone?: string;
      status?: OrderStatus;
      fromDate?: Date;
      toDate?: Date;
      sortBy: string;
      sortOrder: 'asc' | 'desc';
    },
  ) {
    const where: Prisma.OrderWhereInput = {
      shopId,

      ...(query.status && {
        status: query.status,
      }),

      ...(query.customerPhone && {
        customerPhone: {
          contains: query.customerPhone,
          mode: Prisma.QueryMode.insensitive,
        },
      }),

      ...(query.search && {
        customerName: {
          contains: query.search,
          mode: Prisma.QueryMode.insensitive,
        },
      }),

      ...((query.fromDate || query.toDate) && {
        createdAt: {
          ...(query.fromDate && {
            gte: query.fromDate,
          }),
          ...(query.toDate && {
            lte: query.toDate,
          }),
        },
      }),
    };

    const orderBy: Prisma.OrderOrderByWithRelationInput = {
      [query.sortBy]: query.sortOrder,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,

        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      }),

      this.prisma.order.count({
        where,
      }),
    ]);

    return {
      items,
      total,
    };
  }
}
