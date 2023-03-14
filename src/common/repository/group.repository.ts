import { Injectable } from '@nestjs/common';
import { Group } from 'src/database/entities/group.entity';
import { DataSource, In, Not, Repository } from 'typeorm';

@Injectable()
export class GroupRepository extends Repository<Group> {
  constructor(private dataSource: DataSource) {
    super(Group, dataSource.createEntityManager());
  }

  // 전체 그룹 리스트
  async getGroupsWithOutIds(groupIds) {
    return await this.find({
      select: [
        'id',
        'groupName',
        'groupImage',
        'backgroundImage',
        'description',
      ],
      relations: ['tagGroups.tag'],
      where: { id: Not(In(groupIds)) },
    });
  }

  async getGroupsWithIds(groupIds) {
    return await this.find({
      select: [
        'id',
        'groupName',
        'groupImage',
        'backgroundImage',
        'description',
      ],
      relations: ['tagGroups.tag'],
      where: groupIds,
    });
  }

  async getMyGroupList(userId) {
    return await this.find({
      select: [
        'id',
        'groupName',
        'groupImage',
        'backgroundImage',
        'description',
        'user',
      ],
      relations: ['user'],
      where: { userGroups: { userId, role: Not('가입대기') } },
    });
  }

  async foundGroupByGroupId(groupId) {
    return await this.findOne({
      where: { id: groupId },
      relations: ['tagGroups.tag'],
    });
  }

  async foundGroupWithLeader(groupId) {
    return await this.findOne({
      where: { id: groupId },
      relations: ['user'],
    });
  }
}
