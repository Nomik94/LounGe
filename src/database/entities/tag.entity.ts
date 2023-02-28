import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { NewsFeed } from './newsFeed.entity';

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tagName: string;

  @ManyToMany(() => NewsFeed, (newsFeed) => newsFeed.tags)
  newsFeeds: NewsFeed[];

  @ManyToMany(() => Group, (group) => group.tags)
  groups: Group[];
}
