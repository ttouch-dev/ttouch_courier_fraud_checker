import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Plan } from '@prisma/client';

const PLAN_LIMITS: Record<Plan, number> = {
  FREE: 20,
  STARTER: 200,
  PRO: 999999,
  ENTERPRISE: 999999,
};

const MOCK_COURIERS = [
  { name: 'Pathao', slug: 'pathao', logo: '🚴' },
  { name: 'Steadfast', slug: 'steadfast', logo: '📦' },
  { name: 'RedX', slug: 'redx', logo: '🔴' },
  { name: 'eCourier', slug: 'ecourier', logo: '⚡' },
  { name: 'Paperfly', slug: 'paperfly', logo: '✈️' },
];

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async checkPhone(userId: string, phone: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    // Reset daily count if it's a new day
    const now = new Date();
    const lastReset = new Date(user.lastSearchReset);
    if (now.toDateString() !== lastReset.toDateString()) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { dailySearches: 0, lastSearchReset: now },
      });
      user.dailySearches = 0;
    }

    const limit = PLAN_LIMITS[user.plan];
    if (user.dailySearches >= limit) {
      throw new ForbiddenException(`Daily search limit reached (${limit}/day). Please upgrade your plan.`);
    }

    // Simulate courier API calls (replace with real API calls in production)
    const couriers = await this.fetchCourierData(phone);
    const totalOrders = couriers.reduce((s, c) => s + c.total, 0);
    const totalSuccess = couriers.reduce((s, c) => s + c.success, 0);
    const totalCancel = couriers.reduce((s, c) => s + c.cancel, 0);
    const successRate = totalOrders > 0 ? Math.round((totalSuccess / totalOrders) * 100) : 0;
    const riskLevel = this.getRiskLevel(successRate);

    // Save search log
    await this.prisma.searchLog.create({
      data: {
        userId,
        phone,
        totalOrders,
        success: totalSuccess,
        cancel: totalCancel,
        successRate,
        riskLevel,
        rawData: couriers as any,
      },
    });

    // Increment counters
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        dailySearches: { increment: 1 },
        searchCount: { increment: 1 },
      },
    });

    return {
      phone,
      totalOrders,
      totalSuccess,
      totalCancel,
      overallSuccessRate: successRate,
      riskLevel,
      couriers,
      searchedAt: new Date().toISOString(),
    };
  }

  async getHistory(userId: string, page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const where: any = { userId };
    if (search) where.phone = { contains: search };

    const [data, total] = await Promise.all([
      this.prisma.searchLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true, phone: true, successRate: true, riskLevel: true,
          totalOrders: true, success: true, cancel: true, createdAt: true,
        },
      }),
      this.prisma.searchLog.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAdminLogs(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) where.phone = { contains: search };

    const [data, total] = await Promise.all([
      this.prisma.searchLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { name: true } },
        },
      }),
      this.prisma.searchLog.count({ where }),
    ]);

    return {
      data: data.map((l) => ({ ...l, userName: l.user.name })),
      total, page, limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private getRiskLevel(rate: number): string {
    if (rate >= 80) return 'LOW';
    if (rate >= 60) return 'MEDIUM';
    if (rate >= 40) return 'HIGH';
    return 'CRITICAL';
  }

  private async fetchCourierData(phone: string) {
    // In production: make real HTTP calls to each courier API
    // For now, return simulated data
    return MOCK_COURIERS.map((courier) => {
      const total = Math.floor(Math.random() * 15) + 1;
      const success = Math.floor(Math.random() * total);
      const cancel = total - success;
      const successRate = total > 0 ? Math.round((success / total) * 100) : 0;
      return {
        courier: courier.name,
        logo: courier.logo,
        total,
        success,
        cancel,
        successRate,
        status: 'active',
      };
    }).filter((c) => c.total > 0);
  }
}
