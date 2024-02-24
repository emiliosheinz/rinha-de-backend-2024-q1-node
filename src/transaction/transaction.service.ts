import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/db/db.constants';
import { Database } from 'src/db/db.types';
import { CreateTransactionDto } from './create-transaction.dto';
import { Transaction } from './transaction.entity';
import { PoolClient } from 'pg';

@Injectable()
export class TransactionService {
  constructor(@Inject(DATABASE_CONNECTION) private db: Database) {}

  async create(
    customerId: number,
    dto: CreateTransactionDto,
    client?: PoolClient,
  ): Promise<void> {
    await (client || this.db).query(
      'INSERT INTO transactions(tipo, customer_id, valor, realizada_em, descricao) VALUES($1, $2, $3, $4, $5)',
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
      'SELECT valor, tipo, realizada_em, descricao FROM transactions WHERE customer_id = $1 ORDER BY realizada_em DESC LIMIT $2',
      [customerId, limit],
    );
    return rows;
  }
}
