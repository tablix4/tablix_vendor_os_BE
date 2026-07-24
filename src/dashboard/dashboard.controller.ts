import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { DashboardService } from './dashboard.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Dashboard Summary',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data',
  })
  async dashboard(
    @Request() req: { user: { id: string } },
    @Query() query: DashboardQueryDto,
  ) {
    return this.dashboardService.getDashboard(
      req.user.id,
      query.startDate,
      query.endDate,
    );
  }
}
