import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TitularModule } from './titular/titular.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
    TitularModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
