import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  if (process.env.NODE_ENV !== 'production') require('dotenv').config();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
