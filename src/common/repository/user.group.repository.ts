import { Injectable } from '@nestjs/common';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserGroupRepository extends Repository<UserGroup> {
  constructor(private dataSource: DataSource) {
    super(UserGroup, dataSource.createEntityManager());
  }

  checkJoinGroup(userId:number,groupId:number) {
    return this.find({where: {userId: userId, groupId:groupId}})
  }

  checkUserStatus(userId:number){
    return this.find({
      where: [{userId:userId, role:'그룹장'}, {userId:userId, role:'회원'}]
    })
  }

}
