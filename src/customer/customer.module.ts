import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [CustomerService],
  imports: [DbModule],
  exports: [CustomerService],
})
export class CustomerModule {}
