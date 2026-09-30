import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DevoteesService } from './devotees.service';

@ApiTags('Devotees')
@Controller('api/v1/devotees')
export class DevoteesController {
  constructor(private readonly devoteesService: DevoteesService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register Devotee Profile' })
  async register(@Body() body: { name: string; phone: string; email?: string; city?: string; panNumber?: string }) {
    return this.devoteesService.register(body);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get Devotee Profile by Phone' })
  async getProfile(@Query('phone') phone: string) {
    return this.devoteesService.getProfile(phone);
  }

  @Get()
  @ApiOperation({ summary: 'List All Registered Devotees' })
  async listAll() {
    return this.devoteesService.listAll();
  }
}
