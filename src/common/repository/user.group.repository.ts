import { Injectable } from '@nestjs/common';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { Between, DataSource, Not, Repository } from 'typeorm';

@Injectable()
export class UserGroupRepository extends Repository<UserGroup> {
  constructor(private dataSource: DataSource) {
    super(UserGroup, dataSource.createEntityManager());
  }

  async checkJoinGroup(userId: number, groupId: number): Promise<UserGroup> {
    return await this.findOne({ where: { userId: userId, groupId: groupId } });
  }

  async checkUserStatus(userId: number): Promise<UserGroup[]> {
    return await this.find({
      where: [
        { userId: userId, role: '그룹장' },
        { userId: userId, role: '회원' },
      ],
    });
  }

  async getMemberList(groupId: number): Promise<UserGroup[]> {
    return await this.find({
      where: { groupId, role: Not('가입대기') },
      relations: ['user'],
      order: { role: 'ASC' },
    });
  }

  async getGroupJoinRequestList(groupId: number): Promise<UserGroup[]> {
    return await this.find({
      where: { groupId, role: '가입대기' },
      select: ['userId', 'groupId'],
      relations: ['user'],
    });
  }

  async getLankerGroups(): Promise<UserGroup[]> {
    return await this.createQueryBuilder('userGroups')
      .select('userGroups.groupId as groupId')
      .addSelect('COUNT(userGroups.groupId) as count')
      .having('count >= :count', { count: 5 })
      .groupBy('userGroups.groupId')
      .getRawMany();
  }

  async getMyGroupsWithTime(userId, startStr, endStr): Promise<UserGroup[]> {
    return await this.find({
      where: {
        userId,
        role: Not('가입대기'),
        group: { groupEvents: { start: Between(startStr, endStr) } },
      },
      select: ['groupId'],
    });
  }
}
