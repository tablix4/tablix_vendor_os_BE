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

import { CategoryService } from './category.service';

import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Category',
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
  })
  async create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Categories',
  })
  @ApiResponse({
    status: 200,
    description: 'Category list',
  })
  async findAll(@Request() req: { user: { id: string } }) {
    console.log(req.user.id, 'req.user.id');
    return this.categoryService.getCategories(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Category By Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Category fetched successfully',
  })
  async findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.categoryService.getCategoryById(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Category',
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
  })
  async update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Category',
  })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
  })
  async delete(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.categoryService.deleteCategory(req.user.id, id);
  }
}
