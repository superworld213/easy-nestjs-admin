import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import 'reflect-metadata';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const uploadRoot = resolve(__dirname, '..', process.env.UPLOAD_DIR ?? '../storage/uploads');
  mkdirSync(uploadRoot, { recursive: true });

  app.enableCors({
    credentials: true,
    origin: true,
  });
  app.useStaticAssets(uploadRoot, { prefix: '/uploads/' });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      transform: true,
      whitelist: false,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('MineAdmin Nest API')
    .setDescription('NestJS backend API compatible with the existing MineAdmin web app.')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  const port = Number(process.env.PORT ?? 9502);
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
