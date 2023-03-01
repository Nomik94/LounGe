import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { NewsFeed } from './newsFeed.entity';
import { Tag } from './tag.entity';

@Entity()
export class NewsFeedTag {
  @PrimaryColumn()
  tagId: number;

  @PrimaryColumn()
  newsFeedId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => NewsFeed, (newsFeed) => newsFeed.newsFeedTags)
  newsFeed: NewsFeed;

  @ManyToOne(() => Tag, (tag) => tag.newsFeedTags)
  tag: Tag;
}
