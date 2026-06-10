import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initiate')
  initiatePayment(@Req() req: any, @Body() body: { planId: string; method: string }) {
    return this.paymentsService.initiatePayment(req.user.id, body.planId, body.method);
  }

  @Get('billing-history')
  getBillingHistory(@Req() req: any) {
    return this.paymentsService.getBillingHistory(req.user.id);
  }

  @Post(':id/refund')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  refund(@Param('id') id: string) {
    return this.paymentsService.refund(id);
  }

  @Get('transactions')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  getTransactions(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status') status = '',
  ) {
    return this.paymentsService.getTransactions(+page, +limit, status);
  }
}
