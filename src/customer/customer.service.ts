import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/db/db.constants';
import { Database } from 'src/db/db.types';
import { Customer } from 'src/entities/customer.entity';
import { TransactionType } from 'src/entities/transaction.entity';

@Injectable()
export class CustomerService {
  constructor(@Inject(DATABASE_CONNECTION) private db: Database) {}

  async findById(customerId: number): Promise<Customer | undefined> {
    const { rows } = await this.db.query(
      'SELECT * FROM customers WHERE id = $1',
      [customerId],
    );

    return rows[0];
  }

  calculateNewBalance(
    currentBalance: number,
    transactionType: TransactionType,
    amount: number,
  ): number {
    return transactionType === TransactionType.Debit
      ? currentBalance - amount
      : currentBalance + amount;
  }

  async updateBalance(id: number, newBalance: number): Promise<void> {
    await this.db.query('UPDATE customers SET balance = $1 WHERE id = $2', [
      newBalance,
      id,
    ]);
  }
}
