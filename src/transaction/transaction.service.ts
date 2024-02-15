import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/db/db.constants';
import { Database } from 'src/db/db.types';
import { CreateTransactionDto } from 'src/dtos/create-transaction.dto';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(@Inject(DATABASE_CONNECTION) private db: Database) {}

  async create(customerId: number, dto: CreateTransactionDto): Promise<void> {
    await this.db.query(
      'INSERT INTO transactions(type, customer_id, amount, date, description) VALUES($1, $2, $3, $4, $5)',
      [dto.tipo, customerId, dto.valor, new Date(), dto.descricao],
    );
  }

  async getTransactions({
    customerId,
    limit,
  }: {
    customerId: number;
    limit: number;
  }): Promise<Transaction[]> {
    const { rows } = await this.db.query<Transaction>(
      'SELECT * FROM transactions WHERE customer_id = $1 ORDER BY date DESC LIMIT $2',
      [customerId, limit],
    );
    return rows;
  }
}
