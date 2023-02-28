import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { NewsFeedImage } from './newsFeedImage.entity';
import { Tag } from './tag.entity';
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

  @ManyToMany(() => Tag, (tag) => tag.newsFeeds)
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => Group, (group) => group.newsFeeds)
  groups: Group[];

  @ManyToOne(() => User, (user) => user.newsFeeds)
  user: User;
}
