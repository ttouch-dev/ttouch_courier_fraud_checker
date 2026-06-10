import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.pricingPlan.findMany({ orderBy: { price: 'asc' } });
  }

  async create(data: any) {
    return this.prisma.pricingPlan.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.pricingPlan.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.pricingPlan.delete({ where: { id } });
    return { message: 'Plan deleted' };
  }
}
