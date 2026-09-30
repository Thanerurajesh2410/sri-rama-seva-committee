import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { DevoteesModule } from './devotees/devotees.module';
import { DonationsModule } from './donations/donations.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    PaymentsModule,
    DevoteesModule,
    DonationsModule,
    AuditModule
  ]
})
export class AppModule {}
