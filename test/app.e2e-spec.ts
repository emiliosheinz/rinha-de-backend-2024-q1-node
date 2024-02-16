import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { newDb } from 'pg-mem';
import { DATABASE_CONNECTION } from 'src/db/db.constants';
import * as fs from 'fs';
import * as path from 'path';

const isoDateRegex =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const db = newDb();

    const initScript = fs.readFileSync(
      path.resolve(__dirname, '../script.sql'),
      'utf8',
    );
    db.public.none(initScript);
    const dbConnection = db.adapters.createPg();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DATABASE_CONNECTION)
      .useValue(new dbConnection.Pool())
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  describe('GET clientes/:id/extrato/', () => {
    it('should return 404 when the customer id does not exist', () => {
      return app
        .inject({
          method: 'GET',
          url: 'clientes/6/extrato',
        })
        .then((result) => {
          expect(result.statusCode).toEqual(404);
        });
    });

    it('should return 200 with no transactions', () => {
      return app
        .inject({
          method: 'GET',
          url: 'clientes/1/extrato',
        })
        .then((result) => {
          expect(result.statusCode).toEqual(200);
          expect(result.json()).toEqual({
            saldo: {
              total: 0,
              data_extrato: expect.stringMatching(isoDateRegex),
              limite: 100000,
            },
            ultimas_transacoes: [],
          });
        });
    });

    it('should return transactions in the right order when there are some', async () => {
      await app.inject({
        method: 'POST',
        url: 'clientes/1/transacoes',
        payload: {
          tipo: 'c',
          valor: 100,
        },
      });

      await app.inject({
        method: 'POST',
        url: 'clientes/1/transacoes',
        payload: {
          tipo: 'd',
          valor: 50,
        },
      });

      return app
        .inject({
          method: 'GET',
          url: 'clientes/1/extrato',
        })
        .then((result) => {
          expect(result.statusCode).toEqual(200);
          expect(result.json()).toEqual({
            saldo: {
              total: 50,
              data_extrato: expect.stringMatching(isoDateRegex),
              limite: 100000,
            },
            ultimas_transacoes: [
              {
                valor: 50,
                tipo: 'd',
                realizada_em: expect.stringMatching(isoDateRegex),
                descricao: null,
              },
              {
                valor: 100,
                tipo: 'c',
                realizada_em: expect.stringMatching(isoDateRegex),
                descricao: null,
              },
            ],
          });
        });
    });

    it('should return a limit of 10 transactions', async () => {
      for (let i = 0; i < 15; i++) {
        await app.inject({
          method: 'POST',
          url: 'clientes/1/transacoes',
          payload: {
            tipo: 'c',
            valor: 100,
          },
        });
      }

      return app
        .inject({
          method: 'GET',
          url: 'clientes/1/extrato',
        })
        .then((result) => {
          expect(result.statusCode).toEqual(200);
          expect(result.json().ultimas_transacoes).toHaveLength(10);
        });
    });
  });
});
