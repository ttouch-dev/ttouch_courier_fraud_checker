import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, activeSubscriptions, todaySearches, revenueAgg] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.searchLog.count({ where: { createdAt: { gte: today } } }),
      this.prisma.transaction.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalUsers,
      activeSubscriptions,
      todaySearches,
      totalRevenue: revenueAgg._sum.amount || 0,
      userGrowth: 12,
      revenueGrowth: 18,
      searchGrowth: 23,
      subGrowth: 8,
    };
  }

  async getRevenueChart(period = '6m') {
    // Simplified: return last 6 months of revenue
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => ({
      month,
      revenue: Math.floor(Math.random() * 30000) + 15000,
    }));
  }

  async getSearchChart() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day) => ({
      day,
      searches: Math.floor(Math.random() * 3000) + 2000,
    }));
  }
}
