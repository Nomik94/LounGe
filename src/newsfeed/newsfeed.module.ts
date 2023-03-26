import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CommentRepository } from 'src/common/repository/comment.repository';
import { GroupRepository } from 'src/common/repository/group.repository';
import { NewsfeedRepository } from 'src/common/repository/newsfeed.repository';
import { NewsfeedTagRepository } from 'src/common/repository/newsfeed.tag.repository';
import { NewsfeedImageRepository } from 'src/common/repository/newsfeedImage.repository';
import { TagRepository } from 'src/common/repository/tag.repository';
import { UserGroupRepository } from 'src/common/repository/user.group.repository';
import { UserRepository } from 'src/common/repository/user.repository';
import { multerOptionsFactory } from 'src/common/utils/multer.options';
import { Group } from 'src/database/entities/group.entity';
import { NewsFeedTag } from 'src/database/entities/newsFeed-Tag.entity';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { NewsFeedImage } from 'src/database/entities/newsFeedImage.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { User } from 'src/database/entities/user.entity';
import { Comment } from 'src/database/entities/comment.entity';
import { NewsfeedController } from './newsfeed.controller';
import { NewsfeedService } from './newsfeed.service';

@Module({
  imports: [
    NestjsFormDataModule,
    MulterModule.registerAsync({ useFactory: multerOptionsFactory }),
    TypeOrmModule.forFeature([
      NewsFeed,
      Tag,
      NewsFeedTag,
      NewsFeedImage,
      User,
      Group,
      UserGroup,
      Comment
    ]),
    ElasticsearchModule.register({
      node: 'http://localhost:9200'
    })
  ],
  controllers: [NewsfeedController],
  providers: [
    NewsfeedService,
    NewsfeedRepository,
    TagRepository,
    NewsfeedTagRepository,
    NewsfeedImageRepository,
    UserRepository,
    GroupRepository,
    UserGroupRepository,
    CommentRepository
  ],
})
export class NewsfeedModule {}
