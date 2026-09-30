import { Module } from '@nestjs/common';
import { DevoteesController } from './devotees.controller';
import { DevoteesService } from './devotees.service';

@Module({
  controllers: [DevoteesController],
  providers: [DevoteesService],
  exports: [DevoteesService]
})
export class DevoteesModule {}
