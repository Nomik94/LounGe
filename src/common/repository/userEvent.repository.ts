import { Injectable } from '@nestjs/common';
import { UserEvent } from 'src/database/entities/userEvent.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserEventRepository extends Repository<UserEvent> {
  constructor(private dataSource: DataSource) {
    super(UserEvent, dataSource.createEntityManager());
  }
}
