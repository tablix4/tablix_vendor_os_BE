import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { OrderService } from './order.service';

import { CreateOrderDto, UpdateOrderStatusDto } from './dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Order',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
  })
  async create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Orders',
  })
  async findAll(@Request() req: { user: { id: string } }) {
    return this.orderService.getOrders(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Order Details',
  })
  async findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.orderService.getOrderById(req.user.id, id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update Order Status',
  })
  async updateStatus(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(req.user.id, id, dto);
  }
}
