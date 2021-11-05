import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { TitularModule } from './titular/titular.module';
import { BancoModule } from './banco/banco.module';
import { ContaBancoModule } from './conta-banco/conta-banco.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const titularConfig = new DocumentBuilder()
    .setTitle('DinoBank API - Titular')
    .setDescription('DinoBank API for banks')
    .setVersion('1.0')
    .build();

  const titularDocument = SwaggerModule.createDocument(app, titularConfig, {
    include: [TitularModule],
  });
  SwaggerModule.setup('api/titular', app, titularDocument);

  const bancoConfig = new DocumentBuilder()
    .setTitle('DinoBank API - Banco')
    .setDescription('DinoBank API for banks')
    .setVersion('1.0')
    .build();

  const bancoDocument = SwaggerModule.createDocument(app, bancoConfig, {
    include: [BancoModule],
  });
  SwaggerModule.setup('api/banco', app, bancoDocument);

  const contaBancoConfig = new DocumentBuilder()
    .setTitle('DinoBank API - ContaBanco')
    .setDescription('DinoBank API for banks')
    .setVersion('1.0')
    .build();

  const contaBancoDocument = SwaggerModule.createDocument(
    app,
    contaBancoConfig,
    {
      include: [ContaBancoModule],
    },
  );
  SwaggerModule.setup('api/contaBanco', app, contaBancoDocument);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
