import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('NestBootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend web and admin portals
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
  });

  // Enable Global DTO Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false
    })
  );

  // Configure Interactive Swagger OpenAPI Documentation at /api/v1/docs
  const config = new DocumentBuilder()
    .setTitle('Sri Rama Seva Committee (SRSC) Enterprise REST API')
    .setDescription('Enterprise Digital Temple Platform API for Devotees, Donations, Razorpay Payments, and ERP Admin Ledger')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Payments', 'Razorpay order creation, webhooks, and HMAC-SHA256 signature verification')
    .addTag('Donations', 'E-Hundi donation records, category schemes, and 80G tax receipt issuance')
    .addTag('Devotees', 'Devotee profiles, phone verification, and PAN card registration')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`=============================================================`);
  logger.log(`🚩 NestJS Enterprise API running at: http://localhost:${port}`);
  logger.log(`📜 Swagger API Docs available at: http://localhost:${port}/api/v1/docs`);
  logger.log(`=============================================================`);
}

bootstrap();
