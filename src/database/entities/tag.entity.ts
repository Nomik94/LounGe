import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { TagGroup } from './tag-group.entity';
import { NewsFeedTag } from './newsFeed-Tag.entity';
import { Group } from './group.entity';

@Entity()
@Unique(['tagName'])
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tagName: string;

  @OneToMany(() => TagGroup, (tagGroup) => tagGroup.tag)
  tagGroups: TagGroup[];

  @OneToMany(() => NewsFeedTag, (newsFeedTag) => newsFeedTag.tag)
  newsFeedTags: NewsFeedTag[];

  // @ManyToMany(() => Group, (groups) => groups.tags)
  // groups : Group[]
}
