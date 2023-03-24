import { Injectable } from '@nestjs/common';
import { Group } from 'src/database/entities/group.entity';
import { DataSource, In, Not, NotBrackets, Repository } from 'typeorm';

@Injectable()
export class GroupRepository extends Repository<Group> {
  constructor(private dataSource: DataSource) {
    super(Group, dataSource.createEntityManager());
  }

  // 전체 그룹 리스트
  async getAllGroupList(page: number, pageSize: number): Promise<Group[]> {
    return await this.createQueryBuilder('group')
      .select([
        'group.id',
        'group.groupName',
        'group.groupImage',
        'group.backgroundImage',
        'group.description',
        'tagGroups.tagId',
        'tag.tagName',
      ])
      .leftJoin('group.tagGroups', 'tagGroups')
      .leftJoin('tagGroups.tag', 'tag')
      .take(pageSize)
      .skip(pageSize * (page - 1))
      .getMany();
  }

  // 미가입 그룹 리스트
  async getGroupsWithOutIds(
    groupIds: number[],
    page: number,
    pageSize: number,
  ): Promise<Group[]> {
    return await this.createQueryBuilder('group')
      .select([
        'group.id',
        'group.groupName',
        'group.groupImage',
        'group.backgroundImage',
        'group.description',
        'tagGroups.tagId',
        'tag.tagName',
      ])
      .leftJoin('group.tagGroups', 'tagGroups')
      .leftJoin('tagGroups.tag', 'tag')
      .where(
        new NotBrackets((qb) => {
          qb.where('group.id IN (:...groupIds)', { groupIds });
        }),
      )
      .take(pageSize)
      .skip(pageSize * (page - 1))
      .getMany();
  }

  // 가입 신청 그룹 리스트
  async getGroupJoinList(
    groupIds: number[],
    page: number,
    pageSize: number,
  ): Promise<Group[]> {
    return await this.createQueryBuilder('group')
      .select([
        'group.id',
        'group.groupName',
        'group.groupImage',
        'group.backgroundImage',
        'group.description',
        'tagGroups.tagId',
        'tag.tagName',
      ])
      .leftJoin('group.tagGroups', 'tagGroups')
      .leftJoin('tagGroups.tag', 'tag')
      .where('group.id IN (:...groupIds)', { groupIds })
      .take(pageSize)
      .skip(pageSize * (page - 1))
      .getMany();
  }

  // 그룹 태그 검색 리스트
  async getGroupsWithIds(id): Promise<Group[]> {
    return await this.createQueryBuilder('group')
      .select([
        'group.id',
        'group.groupName',
        'group.groupImage',
        'group.backgroundImage',
        'group.description',
        'tagGroups.tagId',
        'tag.tagName',
      ])
      .leftJoin('group.tagGroups', 'tagGroups')
      .leftJoin('tagGroups.tag', 'tag')
      .where('group.id IN (:...id)', { id })
      .getMany();
  }

  // 소속된 그룹 리스트
  async getMyGroupList(
    userId: number,
    page: number,
    pageSize: number,
  ): Promise<Group[]> {
    return await this.createQueryBuilder('group')
      .select([
        'group.id',
        'group.groupName',
        'group.groupImage',
        'group.backgroundImage',
        'group.description',
        'user.username',
        'user.image',
      ])
      .leftJoin('group.user', 'user')
      .leftJoin('group.userGroups','userGroups')
      .where('userGroups.userId = :userId', { userId })
      .andWhere(new NotBrackets((qb) => {
        qb.where('userGroups.role = :role', { role : '가입대기' });
      }))
      .take(pageSize)
      .skip(pageSize * (page - 1))
      .getMany();
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
