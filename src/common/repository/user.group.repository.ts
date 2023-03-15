import { Injectable } from '@nestjs/common';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { DataSource, Not, Repository } from 'typeorm';

@Injectable()
export class UserGroupRepository extends Repository<UserGroup> {
  constructor(private dataSource: DataSource) {
    super(UserGroup, dataSource.createEntityManager());
  }

  async checkJoinGroup(userId:number,groupId:number):Promise<UserGroup[]>{
    return await this.find({where: {userId: userId, groupId:groupId}})
  }

  async checkUserStatus(userId:number):Promise<UserGroup[]>{
    return await this.find({
      where: [{userId:userId, role:'그룹장'}, {userId:userId, role:'회원'}]
    })
  }

  async getMemberList(groupId) {
    return await this.find({
      where: { groupId, role: Not('가입대기') },
      relations: ['user'],
      order: { role: 'ASC' },
    });
  }

  async getGroupJoinRequestList(groupId) {
    return await this.find({
      where: { groupId, role: '가입대기' },
      select: ['userId', 'groupId'],
      relations: ['user'],
    });
  }
}
