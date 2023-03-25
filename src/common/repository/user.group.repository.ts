import { Injectable } from '@nestjs/common';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { DataSource, Not, NotBrackets, Repository } from 'typeorm';

@Injectable()
export class UserGroupRepository extends Repository<UserGroup> {
  constructor(private dataSource: DataSource) {
    super(UserGroup, dataSource.createEntityManager());
  }

  async checkJoinGroup(userId: number, groupId: number): Promise<UserGroup[]> {
    return await this.find({ where: { userId: userId, groupId: groupId } });
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

  async getMemberCount(groupIds) {
    return this.createQueryBuilder('userGroup')
      .select('userGroup.groupId', 'groupId')
      .addSelect('COUNT(*)', 'member')
      .where('userGroup.groupId IN (:...id)', { id: groupIds })
      .andWhere(
        new NotBrackets((qb) => {
          qb.where('userGroup.role = :role', { role: '가입대기' });
        }),
      )
      .groupBy('userGroup.groupId')
      .getRawMany();
  }
}
