import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CouriersService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.courier.findMany({ orderBy: { totalSearches: 'desc' } });
  }

  async update(id: string, data: any) {
    return this.prisma.courier.update({ where: { id }, data });
  }

  async toggle(id: string) {
    const courier = await this.prisma.courier.findUnique({ where: { id } });
    return this.prisma.courier.update({ where: { id }, data: { isActive: !courier.isActive } });
  }
}
