import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IDevotee } from '@temple/types';

@Injectable()
export class DevoteesService {
  private devotees: Map<string, IDevotee> = new Map();

  async register(params: { name: string; phone: string; email?: string; city?: string; panNumber?: string }) {
    if (!params.name || !params.phone) {
      throw new BadRequestException('Devotee name and phone number are required');
    }

    const existing = Array.from(this.devotees.values()).find(d => d.phone === params.phone);
    if (existing) {
      return existing;
    }

    const devotee: IDevotee = {
      id: `DEV-${Date.now()}`,
      name: params.name,
      phone: params.phone,
      email: params.email || 'sriramasevacommitteepvv@gmail.com',
      city: params.city || 'పామినివాండ్లవూరు',
      panNumber: params.panNumber?.toUpperCase(),
      registeredAt: new Date(),
      updatedAt: new Date()
    };

    this.devotees.set(devotee.id, devotee);
    return devotee;
  }

  async getProfile(phone: string) {
    const devotee = Array.from(this.devotees.values()).find(d => d.phone === phone);
    if (!devotee) {
      throw new NotFoundException('Devotee account not found');
    }
    return devotee;
  }

  async listAll() {
    return Array.from(this.devotees.values());
  }
}
