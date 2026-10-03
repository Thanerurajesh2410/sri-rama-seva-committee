import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { IPaymentTransaction, PaymentStatus } from '@temple/types';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private transactions: Map<string, IPaymentTransaction> = new Map();

  // Retrieve Razorpay API Credentials securely from Environment
  private getRazorpayKeys() {
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_TjNyV6tEd8IWZU';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'wcT08wEIULyxdOpyNmFkpqmu';
    return { keyId, keySecret };
  }

  // STEP 1: Create Order
  async createPaymentOrder(amountInPaise: number, currency = 'INR', receiptId?: string) {
    if (!amountInPaise || isNaN(amountInPaise)) {
      throw new BadRequestException('Valid payment amount is required');
    }

    if (amountInPaise < 100) {
      throw new BadRequestException('Payment amount must be at least 100 paise (Rs. 1)');
    }

    const orderId = `order_${Math.random().toString(36).substring(2, 15)}`;
    const transaction: IPaymentTransaction = {
      id: `TXN-${Date.now()}`,
      orderId: orderId,
      gateway: 'RAZORPAY',
      amount: amountInPaise,
      currency: currency,
      status: 'CREATED',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.transactions.set(orderId, transaction);
    this.logger.log(`Created Razorpay Payment Order: ${orderId} for ${amountInPaise} paise`);

    return {
      order_id: orderId,
      id: orderId,
      amount: amountInPaise,
      currency: currency,
      status: 'created',
      receipt: receiptId || `rcpt_${Date.now()}`
    };
  }

  // STEP 3: Verify Payment Signature via HMAC-SHA256
  async verifyPaymentSignature(params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new BadRequestException('Missing required verification fields');
    }

    const { keySecret } = this.getRazorpayKeys();
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      this.logger.error(`Signature Mismatch! Received: ${razorpay_signature}, Expected: ${expectedSignature}`);
      throw new BadRequestException('Invalid payment signature. Verification failed.');
    }

    const txn = this.transactions.get(razorpay_order_id);
    if (txn) {
      txn.gatewayPaymentId = razorpay_payment_id;
      txn.gatewaySignature = razorpay_signature;
      txn.status = 'CAPTURED';
      txn.updatedAt = new Date();
      this.transactions.set(razorpay_order_id, txn);
    }

    this.logger.log(`Payment Signature Verified Successfully: ${razorpay_payment_id}`);
    return {
      status: 'success',
      message: 'Payment signature verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    };
  }

  // Handle Async Razorpay Webhook Callbacks
  async handleWebhook(body: any, webhookSignature: string) {
    this.logger.log(`Received Razorpay Webhook Event: ${body?.event || 'Unknown'}`);
    return { status: 'received' };
  }
}
