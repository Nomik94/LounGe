import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { GroupNewsFeed } from 'src/database/entities/group-newsfeed.entity';
import { Group } from 'src/database/entities/group.entity';
import { NewsFeedTag } from 'src/database/entities/newsFeed-Tag.entity';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { NewsFeedImage } from 'src/database/entities/newsFeedImage.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { User } from 'src/database/entities/user.entity';
import { NewsfeedController } from './newsfeed.controller';
import { NewsfeedService } from './newsfeed.service';
import { newsfeedImageFactory } from './utills/newsfeed.img.multer';

@Module({
  imports : [
    NestjsFormDataModule,
    MulterModule.registerAsync({ useFactory: newsfeedImageFactory }),
    TypeOrmModule.forFeature([NewsFeed,Tag,NewsFeedTag,NewsFeedImage,User,Group,UserGroup,GroupNewsFeed])],
  controllers: [NewsfeedController],
  providers: [NewsfeedService]
})
export class NewsfeedModule {}
