import { Injectable, BadRequestException } from '@nestjs/common';
import { IDonation } from '@temple/types';

@Injectable()
export class DonationsService {
  private donations: IDonation[] = [];

  async createDonation(params: {
    donorName: string;
    phone: string;
    email?: string;
    city?: string;
    category: string;
    subcategory?: string;
    amount: number;
    paymentId?: string;
    panNumber?: string;
  }) {
    if (!params.donorName || !params.amount || params.amount <= 0) {
      throw new BadRequestException('Donor name and valid donation amount are required');
    }

    const receiptNumber = `SRS-2026-${String(this.donations.length + 1).padStart(6, '0')}`;
    const donation: IDonation = {
      id: `DON-${Date.now()}`,
      receiptNumber,
      donorName: params.donorName,
      phone: params.phone || '9866125609',
      email: params.email || 'sriramasevacommitteepvv@gmail.com',
      city: params.city || 'పామినివాండ్లవూరు',
      category: params.category || 'ఆలయ నిర్మాణ నిధి',
      subcategory: params.subcategory || 'రాతి గోడల నిర్మాణం',
      amount: params.amount,
      paymentId: params.paymentId,
      panNumber: params.panNumber?.toUpperCase(),
      is80gEligible: true,
      date: new Date()
    };

    this.donations.unshift(donation);
    return donation;
  }

  async listDonations(limit = 100) {
    return this.donations.slice(0, limit);
  }
}
