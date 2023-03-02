import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsFeedTag } from 'src/database/entities/newsFeed-Tag.entity';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { NewsFeedImage } from 'src/database/entities/newsFeedImage.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { NewsfeedController } from './newsfeed.controller';
import { NewsfeedService } from './newsfeed.service';

@Module({
  imports : [TypeOrmModule.forFeature([NewsFeed,Tag,NewsFeedTag,NewsFeedImage])],
  controllers: [NewsfeedController],
  providers: [NewsfeedService]
})
export class NewsfeedModule {}
