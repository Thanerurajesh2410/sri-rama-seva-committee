import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DonationsService } from './donations.service';

@ApiTags('Donations')
@Controller('api/v1/donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Donation & Issue Official Receipt' })
  async createDonation(
    @Body() body: { donorName: string; phone: string; email?: string; city?: string; category: string; subcategory?: string; amount: number; paymentId?: string; panNumber?: string }
  ) {
    return this.donationsService.createDonation(body);
  }

  @Get()
  @ApiOperation({ summary: 'List Donations Ledger' })
  async listDonations(@Query('limit') limit?: number) {
    return this.donationsService.listDonations(limit ? Number(limit) : 100);
  }
}
