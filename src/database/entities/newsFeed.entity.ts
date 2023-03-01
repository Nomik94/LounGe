import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GroupNewsFeed } from './group-newsfeed.entity';
import { NewsFeedImage } from './newsFeedImage.entity';
import { NewsFeedTag } from './newsFeed-Tag.entity';
import { User } from './user.entity';

@Entity()
export class NewsFeed extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => NewsFeedImage, (newsFeedImage) => newsFeedImage.newsFeed)
  newsImages: NewsFeedImage[];

  @ManyToOne(() => User, (user) => user.newsFeeds)
  user: User;

  @OneToMany(() => GroupNewsFeed, (groupNewsFeed) => groupNewsFeed.newsFeed)
  groupNewsFeeds: GroupNewsFeed[];

  @OneToMany(() => NewsFeedTag, (newsFeedTag) => newsFeedTag.newsFeed)
  newsFeedTags: NewsFeedTag[];
}
