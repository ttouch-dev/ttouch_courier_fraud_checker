import { Controller, Post, Get, Body, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SearchService } from './search.service';

class CheckPhoneDto {
  @IsString()
  @Matches(/^(\+880|0)1[3-9]\d{8}$/, { message: 'Invalid BD phone number' })
  phone: string;
}

@ApiTags('Search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Post('check')
  checkPhone(@Req() req: any, @Body() dto: CheckPhoneDto) {
    return this.searchService.checkPhone(req.user.id, dto.phone);
  }

  @Get('history')
  getHistory(
    @Req() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
  ) {
    return this.searchService.getHistory(req.user.id, +page, +limit, search);
  }
}
