import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll(page = 1, limit = 10, search = '', plan = '') {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }
    if (plan) where.plan = plan;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, phone: true, plan: true,
          role: true, isActive: true, searchCount: true, createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, phone: true, plan: true,
        role: true, isActive: true, searchCount: true, dailySearches: true,
        apiToken: true, createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: any) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true, name: true, email: true, phone: true, plan: true,
        role: true, isActive: true, searchCount: true, createdAt: true,
      },
    });
    return user;
  }

  async delete(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  async generateApiToken(userId: string) {
    const apiToken = `bdc_${uuidv4().replace(/-/g, '')}`;
    await this.prisma.user.update({ where: { id: userId }, data: { apiToken } });
    return { token: apiToken };
  }
}
