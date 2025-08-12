import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { clerkMiddleware, createClerkClient } from '@clerk/express';
// import * as mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });
  app.setGlobalPrefix('api');
<<<<<<< HEAD
  const domain = process.env.DOMAIN ? JSON.parse(process.env.DOMAIN) : [];
  console.log('Allowed domains:', domain);
  app.enableCors({ origin: ["http://fs3s-hmlogbook:3000", "http://fs3s-hmlogbook:3001"], credentials: true });
=======
  app.enableCors({ origin: process.env.DOMAIN, credentials: true });
>>>>>>> b4c46e61970fb7fa4849b07c2d96b7f4c514ff28
  app.use(cookieParser());
  app.use(clerkMiddleware({ clerkClient }));
  // const debugMode = process.env.MONGO_DEBUG === 'true';
  // console.log('Debug Mode:', debugMode);
  // if (debugMode) {
  //   mongoose.set('debug', true);
  //   console.log('Mongoose debug mode is enabled');
  // }
  await app.listen(8000);
}
bootstrap();
