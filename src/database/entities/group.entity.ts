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
import { GroupEvent } from './groupEvent.entity';
import { NewsFeed } from './newsFeed.entity';
import { Tag } from './tag.entity';
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

  @ManyToMany(() => NewsFeed, (newsFeed) => newsFeed.groups)
  @JoinTable()
  newsFeeds: NewsFeed[];

  @OneToMany(() => GroupEvent, (groupEvent) => groupEvent.group)
  groupEvents: GroupEvent[];

  @ManyToMany(() => Tag, (tag) => tag.groups)
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];

  @ManyToOne(() => User, (user) => user.group)
  user: User;
}
