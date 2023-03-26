import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { GroupRepository } from 'src/common/repository/group.repository';
import { TagGroupRepository } from 'src/common/repository/tag.group.repository';
import { TagRepository } from 'src/common/repository/tag.repository';
import { UserGroupRepository } from 'src/common/repository/user.group.repository';
import { multerOptionsFactory } from 'src/common/utils/multer.options';
import { Group } from 'src/database/entities/group.entity';
import { TagGroup } from 'src/database/entities/tag-group.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node : "http://localhost:9200"
    }),
    NestjsFormDataModule,
    MulterModule.registerAsync({ useFactory: multerOptionsFactory }),
    TypeOrmModule.forFeature([Group, Tag, TagGroup, UserGroup]),
  ],
  controllers: [GroupController],
  providers: [
    GroupService,
    GroupRepository,
    UserGroupRepository,
    TagGroupRepository,
    TagRepository,
  ],
})
export class GroupModule {}
