import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser())
  app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false}))
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();