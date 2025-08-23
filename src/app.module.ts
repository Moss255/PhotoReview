import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './data/database.sqlite', // The name of your database file
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables (use with caution in production)
    }),
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true, // makes the ConfigModule available everywhere
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
