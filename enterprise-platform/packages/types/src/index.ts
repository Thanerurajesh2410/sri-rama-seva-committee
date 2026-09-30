// Enterprise Digital Temple Platform - Core Shared TypeScript Interfaces

export type RoleName = 'SUPER_ADMIN' | 'TEMPLE_ADMIN' | 'TREASURER' | 'CONTENT_ADMIN' | 'AUDITOR' | 'DEVOTEE';

export type PaymentStatus = 'CREATED' | 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export type DonationCategory = 'STONE_WALLS' | 'SANCTUM' | 'ANNADHANAM' | 'GENERAL_FUND' | 'SPECIAL_SEVA';

export interface IDevotee {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  panNumber?: string; // Optional for 80G tax exemption receipts
  registeredAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: RoleName;
  isActive: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface IDonation {
  id: string;
  receiptNumber: string;
  donorId?: string;
  donorName: string;
  phone: string;
  email?: string;
  city: string;
  category: string;
  subcategory?: string;
  amount: number;
  paymentId?: string;
  panNumber?: string;
  is80gEligible: boolean;
  date: Date;
  notes?: string;
}

export interface IPaymentTransaction {
  id: string;
  orderId: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  gateway: 'RAZORPAY' | 'PHONEPE' | 'PAYTM' | 'CASH_DEPOSIT';
  amount: number; // In Paise or INR
  currency: string;
  status: PaymentStatus;
  rawWebhookData?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReceipt {
  id: string;
  receiptNumber: string; // e.g. SRS-2026-0001008
  donationId: string;
  pdfUrl?: string;
  issuedAt: Date;
  issuedBy: string;
}

export interface ISeva {
  id: string;
  title: string;
  description: string;
  price: number;
  isActive: boolean;
}

export interface ISevaBooking {
  id: string;
  sevaId: string;
  devoteeName: string;
  phone: string;
  bookingDate: Date;
  amount: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: Date;
}

export interface IExpense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: Date;
  voucherNo: string;
  paidTo: string;
  approvedBy: string;
}

export interface IAuditLog {
  id: string;
  userId?: string;
  userRole: string;
  action: string;
  entityName: string;
  entityId?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  timestamp: Date;
}
