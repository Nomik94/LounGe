import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity()
export class UserGroup {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  groupId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userGroups)
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroups)
  group: Group;
}
