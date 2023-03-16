import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity()
export class UserGroup {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  groupId: number;

  @Column({ default: '가입신청' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userGroups)
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroups)
  group: Group;
}
