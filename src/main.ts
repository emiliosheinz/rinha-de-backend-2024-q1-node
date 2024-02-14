import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.API_PORT, process.env.API_HOST);
  console.log(
    '🚀 API running on ',
    `http://${process.env.API_HOST}:${process.env.API_PORT}`,
  );
}
bootstrap();
