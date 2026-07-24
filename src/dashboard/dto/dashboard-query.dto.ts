import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class DashboardQueryDto {
  @ApiPropertyOptional({
    description: 'Start date for dashboard data',
    example: '2026-07-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for dashboard data',
    example: '2026-07-24',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
