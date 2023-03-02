import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfig } from './common/config/typeorm.config';
import { NewsfeedModule } from './newsfeed/newsfeed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    AuthModule,
    NewsfeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
