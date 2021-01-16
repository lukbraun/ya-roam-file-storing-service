import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
if (process.env.NODE_ENV !== 'production') require('dotenv').config({debug: true});

async function bootstrap() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  console.log(process.env.AZURE_COSMOS_DB_NAME);
  console.log(process.env.AZURE_COSMOS_DB_ENDPOINT);
  console.log(process.env.AZURE_COSMOS_DB_KEY);
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
