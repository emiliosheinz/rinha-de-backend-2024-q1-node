import { Inject } from '@nestjs/common';
import { Database } from './db.types';
import { DATABASE_CONNECTION } from './db.constants';
import { PoolClient } from 'pg';

export class DbService {
  constructor(@Inject(DATABASE_CONNECTION) private db: Database) {}

  async startTransaction(): Promise<PoolClient> {
    const client = await this.db.connect();
    await client.query('BEGIN');
    return client;
  }

  async commit(transaction: PoolClient) {
    await transaction.query('COMMIT');
    transaction.release();
  }

  async rollback(transaction: PoolClient) {
    await transaction.query('ROLLBACK');
    transaction.release();
  }
}
