import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Group } from './group.entity';
import { NewsFeed } from './newsFeed.entity';
import { UserGroup } from './user-group.entity';
import { UserEvent } from './userEvent.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column()
  username: string;

  @Column()
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserEvent, (userEvent) => userEvent.user)
  userEvents: UserEvent[];

  @OneToMany(() => NewsFeed, (newsFeed) => newsFeed.user)
  newsFeeds: NewsFeed[];

  @OneToMany(() => Group, (group) => group.user)
  group: Group[];

  @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
  userGroups: UserGroup[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment;
}
