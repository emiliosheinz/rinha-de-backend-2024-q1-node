import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [TransactionService],
  imports: [DbModule],
  exports: [TransactionService],
})
export class TransactionModule {}
