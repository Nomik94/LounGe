import { Injectable } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async checkGroupByUserId(userId: number) {
    return await this.createQueryBuilder('user')
      .select(['group.id', 'user.id', 'userGroups.group.id'])
      .leftJoin('user.userGroups', 'userGroups')
      .leftJoin('userGroups.group', 'group')
      .where('user.id=:id', { id: userId })
      .getOne();
  }
}
