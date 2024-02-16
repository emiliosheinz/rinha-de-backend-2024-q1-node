import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DATABASE_CONNECTION } from 'src/db/db.constants';

export async function setupTestModule(pool: any) {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DATABASE_CONNECTION)
    .useValue(pool)
    .compile();
  const app = moduleRef.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return app;
}
