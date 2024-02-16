import * as fs from 'fs';
import * as path from 'path';
import { IMemoryDb, newDb } from 'pg-mem';

function runDbInitScript(db: IMemoryDb) {
  const initScript = fs.readFileSync(
    path.resolve(__dirname, '../script.sql'),
    'utf8',
  );
  db.public.none(initScript);
}

export function setupDatabae() {
  const db = newDb();
  const dbConnection = db.adapters.createPg();

  runDbInitScript(db);

  return {
    dbConnection,
    backup: db.backup(),
  };
}
