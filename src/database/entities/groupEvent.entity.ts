import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from './group.entity';

@Entity()
export class GroupEvent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventName: string;

  @Column()
  eventContent: string;

  @Column()
  start: string;

  @Column()
  end: string;

  @Column()
  lat: string;

  @Column()
  lng: string;

  @Column()
  location: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Group, (group) => group.groupEvents)
  group: Group;
}
