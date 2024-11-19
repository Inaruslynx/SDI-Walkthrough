import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { clerkMiddleware, createClerkClient } from '@clerk/express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });
  app.setGlobalPrefix('api');
  app.enableCors({ origin: 'http://fs3s-hotmilllog:3001', credentials: true });
  app.use(cookieParser());
  app.use(clerkMiddleware({ clerkClient }));
  await app.listen(8000);
}
bootstrap();
