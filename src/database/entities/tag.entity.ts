import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TagGroup } from './tag-group.entity';
import { NewsFeedTag } from './newsFeed-Tag.entity';

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tagName: string;

  @OneToMany(() => TagGroup, (tagGroup) => tagGroup.tag)
  tagGroups: TagGroup[];

  @OneToMany(() => NewsFeedTag, (newsFeedTag) => newsFeedTag.tag)
  newsFeedTags: NewsFeedTag[];
}
