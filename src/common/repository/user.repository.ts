import { Injectable } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async serchUserInfo(userId:number) {
    return await this.findOne({
      where: {id:userId},
      select: ['email','username','image']
    })
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
