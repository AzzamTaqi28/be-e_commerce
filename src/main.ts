import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'file-upload'), {
    prefix: '/file-upload',
  });
  await app.listen(process.env.PORT);
}
bootstrap();
