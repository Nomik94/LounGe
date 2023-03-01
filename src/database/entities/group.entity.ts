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
import { GroupEvent } from './groupEvent.entity';
import { TagGroup } from './tag-group.entity';
import { UserGroup } from './user-group.entity';
import { User } from './user.entity';

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupName: string;

  @Column()
  description: string;

  @Column()
  groupImage: string;

  @Column()
  backgroundImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => GroupEvent, (groupEvent) => groupEvent.group)
  groupEvents: GroupEvent[];

  @ManyToOne(() => User, (user) => user.group)
  user: User;

  @OneToMany(() => TagGroup, (tagGroup) => tagGroup.group)
  tagGroups: TagGroup[];

  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroups: UserGroup[];

  @OneToMany(() => GroupNewsFeed, (groupNewsFeed) => groupNewsFeed.group)
  groupNewsFeeds: GroupNewsFeed[];
}
