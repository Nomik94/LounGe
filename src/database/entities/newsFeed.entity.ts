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
import { NewsFeedImage } from './newsFeedImage.entity';
import { NewsFeedTag } from './newsFeed-Tag.entity';
import { User } from './user.entity';
import { Group } from './group.entity';
import { Comment } from './comment.entity';

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

  @OneToMany(() => NewsFeedTag, (newsFeedTag) => newsFeedTag.newsFeed)
  newsFeedTags: NewsFeedTag[];

  @ManyToOne(() => Group, (group) => group.newsfeed)
  group: Group;

  @OneToMany(() => Comment, (comment) => comment.newsfeed)
  comment: Comment[];
}
