import { Injectable } from '@nestjs/common';
import { GroupEvent } from 'src/database/entities/groupEvent.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class GroupEventRepository extends Repository<GroupEvent> {
  constructor(private dataSource: DataSource) {
    super(GroupEvent, dataSource.createEntityManager());
  }
}
