import {
  Body,
  Controller,
  Delete,
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

import { MenuService } from './menu.service';

import { CreateMenuItemDto, UpdateMenuItemDto } from './dto';

@ApiTags('Menu')
@ApiBearerAuth()
@Controller('menu-items')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Menu Item',
  })
  @ApiResponse({
    status: 201,
    description: 'Menu item created successfully',
  })
  async create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateMenuItemDto,
  ) {
    return this.menuService.createMenuItem(req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Menu Items',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu items fetched successfully',
  })
  async findAll(@Request() req: { user: { id: string } }) {
    return this.menuService.getMenuItems(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Menu Item',
  })
  async findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.menuService.getMenuItemById(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Menu Item',
  })
  async update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menuService.updateMenuItem(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Menu Item',
  })
  async delete(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.menuService.deleteMenuItem(req.user.id, id);
  }

  @Patch(':id/toggle')
  @ApiOperation({
    summary: 'Toggle Menu Availability',
  })
  async toggle(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.menuService.toggleAvailability(req.user.id, id);
  }
}
