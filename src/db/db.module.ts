import { Module, Provider } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_CONNECTION } from './db.constants';

const dbProvider: Provider = {
  provide: DATABASE_CONNECTION,
  useValue: new Pool({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOSTNAME,
    port: parseInt(process.env.DATABASE_PORT, 10),
  }),
};

@Module({
  exports: [dbProvider],
  providers: [dbProvider],
})
export class DbModule {}
