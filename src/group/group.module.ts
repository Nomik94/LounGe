import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Group } from 'src/database/entities/group.entity';
import { TagGroup } from 'src/database/entities/tag-group.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { groupImageFactory } from './utills/group.img.multer';

@Module({
  imports: [
    NestjsFormDataModule,
    MulterModule.registerAsync({ useFactory: groupImageFactory }),
    TypeOrmModule.forFeature([Group, Tag, TagGroup, UserGroup]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
