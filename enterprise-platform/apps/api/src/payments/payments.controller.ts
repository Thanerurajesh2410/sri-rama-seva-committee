import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @ApiOperation({ summary: 'Create Razorpay Payment Order' })
  @ApiResponse({ status: 200, description: 'Order created successfully' })
  async createOrder(@Body() body: { amount: number; currency?: string; receipt?: string }) {
    return this.paymentsService.createPaymentOrder(body.amount, body.currency, body.receipt);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Razorpay Payment Signature (HMAC-SHA256)' })
  @ApiResponse({ status: 200, description: 'Signature verified successfully' })
  async verifyPayment(
    @Body() body: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
  ) {
    return this.paymentsService.verifyPaymentSignature(body);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Async Razorpay Webhook Event' })
  async handleWebhook(@Body() body: any, @Headers('x-razorpay-signature') signature: string) {
    return this.paymentsService.handleWebhook(body, signature);
  }
}
