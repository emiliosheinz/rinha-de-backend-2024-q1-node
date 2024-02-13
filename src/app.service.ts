import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from './db/db.constants';
import { Database } from './db/db.types';

@Injectable()
export class AppService {
  constructor(@Inject(DATABASE_CONNECTION) private db: Database) {}

  async createTransaction(): Promise<string> {
    const response = await this.db.query('SELECT * from clients;');
    console.log(response.rows);
    return 'Hello World!';
  }
}
