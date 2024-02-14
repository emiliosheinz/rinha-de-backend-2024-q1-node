import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(process.env.API_PORT, process.env.API_HOST);
  console.log('🚀 API running on ', `http://${process.env.API_HOST}:${process.env.API_PORT}`);
}
bootstrap();
