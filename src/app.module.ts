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
import { CalendarModule } from './calendar/calendar.module';
import * as redisStore from 'cache-manager-redis-store';
import { UserModule } from './user/user.module';
import { Group } from './database/entities/group.entity';
import { UserGroup } from './database/entities/user-group.entity';
import { GroupNewsFeed } from './database/entities/group-newsfeed.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    TypeOrmModule.forFeature([Group, UserGroup, GroupNewsFeed]),
    CacheModule.register({
      isGlobal: true,
      // store: "memory",
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    GroupModule,
    AuthModule,
    NewsfeedModule,
    EmailModule,
    CalendarModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
