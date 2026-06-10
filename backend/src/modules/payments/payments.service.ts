import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async initiatePayment(userId: string, planId: string, method: string) {
    const plan = await this.prisma.pricingPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');

    const transactionId = `TXN${uuidv4().replace(/-/g, '').toUpperCase().slice(0, 16)}`;

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        amount: plan.price,
        method,
        transactionId,
        status: 'PENDING',
        planName: plan.name,
      },
    });

    // In production: integrate with bKash/Nagad/SSLCommerz
    // For now, simulate payment URL
    const paymentUrl = `${process.env.APP_URL}/payment/process?txn=${transactionId}&method=${method}`;

    return { transaction, paymentUrl };
  }

  async getTransactions(page = 1, limit = 10, status = '') {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: data.map((t) => ({ ...t, userName: t.user.name })),
      total, page, limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getBillingHistory(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async refund(txId: string) {
    const tx = await this.prisma.transaction.findUnique({ where: { id: txId } });
    if (!tx) throw new NotFoundException('Transaction not found');
    return this.prisma.transaction.update({
      where: { id: txId },
      data: { status: 'REFUNDED' },
    });
  }

  async handlePaymentCallback(transactionId: string, status: 'COMPLETED' | 'FAILED', userId: string) {
    const tx = await this.prisma.transaction.findUnique({ where: { transactionId } });
    if (!tx) throw new NotFoundException('Transaction not found');

    await this.prisma.transaction.update({ where: { transactionId }, data: { status } });

    if (status === 'COMPLETED') {
      // Upgrade user plan
      const planName = tx.planName as any;
      await this.prisma.user.update({ where: { id: userId }, data: { plan: planName } });

      // Create subscription (30 days)
      const plan = await this.prisma.pricingPlan.findFirst({ where: { name: planName } });
      if (plan) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 30);
        await this.prisma.subscription.create({
          data: { userId, planId: plan.id, startDate, endDate, status: 'ACTIVE' },
        });
      }
    }

    return { success: status === 'COMPLETED' };
  }
}
