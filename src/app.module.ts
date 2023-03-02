import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfig } from './common/config/typeorm.config';
import { GroupModule } from './group/group.module';
import { AuthModule } from './auth/auth.module';
import { NewsfeedModule } from './newsfeed/newsfeed.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    CacheModule.register({
      ttl: 300000, // 데이터 캐싱 시간
      max: 100, // 최대 캐싱 개수
      isGlobal: true,
    }),
    GroupModule,
    AuthModule,
    NewsfeedModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
