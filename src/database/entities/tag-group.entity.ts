import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Group } from './group.entity';
import { Tag } from './tag.entity';

@Entity()
export class TagGroup {
  @PrimaryColumn()
  tagId: number;

  @PrimaryColumn()
  groupId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Tag, (tag) => tag.tagGroups)
  tag: Tag;

  @ManyToOne(() => Group, (group) => group.tagGroups)
  group: Group;
}
