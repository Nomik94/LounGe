import { Injectable } from '@nestjs/common';
import { Group } from 'src/database/entities/group.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class GroupRepository extends Repository<Group> {
  constructor(private dataSource: DataSource) {
    super(Group, dataSource.createEntityManager());
  }
}
