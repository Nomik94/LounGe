import { Injectable } from '@nestjs/common';
import { Group } from 'src/database/entities/group.entity';
import { And, DataSource, In, Not, Repository } from 'typeorm';

@Injectable()
export class GroupRepository extends Repository<Group> {
  constructor(private dataSource: DataSource) {
    super(Group, dataSource.createEntityManager());
  }

  // 전체 그룹 리스트
  async getGroupsWithOutIds(
    groupIds: number[],
    page: number,
    pageSize: number,
  ): Promise<Group[]> {
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
      take: pageSize,
      skip: pageSize * (page - 1),
    });
  }

  async getGroupsWithIds(groupIds: { id: number }[]): Promise<Group[]> {
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

  async getMyGroupList(
    userId: number,
    page: number,
    pageSize: number,
  ): Promise<Group[]> {
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
      take: pageSize,
      skip: pageSize * (page - 1),
    });
  }

  async foundGroupByGroupId(groupId: number): Promise<Group> {
    return await this.findOne({
      where: { id: groupId },
      relations: ['tagGroups.tag'],
    });
  }

  async foundGroupWithLeader(groupId: number): Promise<Group> {
    return await this.findOne({
      where: { id: groupId },
      relations: ['user'],
    });
  }
}
