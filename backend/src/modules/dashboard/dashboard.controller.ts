import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  getStats() { return this.dashboardService.getStats(); }

  @Get('revenue-chart')
  getRevenueChart(@Query('period') period = '6m') { return this.dashboardService.getRevenueChart(period); }

  @Get('search-chart')
  getSearchChart() { return this.dashboardService.getSearchChart(); }
}
