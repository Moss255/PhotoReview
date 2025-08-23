import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite', // The name of your database file
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables (use with caution in production)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
