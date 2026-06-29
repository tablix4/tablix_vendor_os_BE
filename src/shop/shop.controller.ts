import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ShopService } from './shop.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateShopDto } from './dto';

@ApiTags('Shop')
@ApiBearerAuth()
@Controller('shop')
@UseGuards(JwtAuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get My Shop',
  })
  @ApiResponse({
    status: 200,
    description: 'Shop fetched successfully',
  })
  async getMyShop(@Request() req: { user: { id: string } }) {
    return this.shopService.getMyShop(req.user.id);
  }

  @Patch()
  @ApiOperation({
    summary: 'Update Shop',
  })
  @ApiResponse({
    status: 200,
    description: 'Shop updated successfully',
  })
  async updateShop(
    @Request() req: { user: { id: string } },
    @Body() dto: UpdateShopDto,
  ) {
    return this.shopService.updateShop(req.user.id, dto);
  }
}
