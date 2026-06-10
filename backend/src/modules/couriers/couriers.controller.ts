import { Controller, Get, Patch, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { CouriersService } from './couriers.service';

@ApiTags('Couriers')
@Controller('couriers')
export class CouriersController {
  constructor(private couriersService: CouriersService) {}

  @Get()
  getAll() { return this.couriersService.getAll(); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.couriersService.update(id, body); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post(':id/toggle')
  toggle(@Param('id') id: string) { return this.couriersService.toggle(id); }
}
