import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Group } from './group.entity';
import { NewsFeed } from './newsFeed.entity';

@Entity()
export class GroupNewsFeed {
  @PrimaryColumn()
  groupId: number;

  @PrimaryColumn()
  newsFeedId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Group, (group) => group.groupNewsFeeds)
  group: Group;

  @ManyToOne(() => NewsFeed, (newsFeed) => newsFeed.groupNewsFeeds)
  newsFeed: NewsFeed;
}
