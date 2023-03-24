import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroupRepository } from 'src/common/repository/group.repository';
import { TagGroupRepository } from 'src/common/repository/tag.group.repository';
import { TagRepository } from 'src/common/repository/tag.repository';
import { UserGroupRepository } from 'src/common/repository/user.group.repository';
import { CreateGroupDto } from './dto/create.group.dto';
import { ModifyGroupDto } from './dto/modify.group.dto';
import { IMapGroups } from './interface/map.group.tag.interface';
import { IGroupWithMemberIdsStr } from './interface/member.group.ids.interface';
import { IMyGroupList } from './interface/get.my.group.list.interface';
import { Group } from 'src/database/entities/group.entity';
import { IMemberList } from './interface/group.member.list.interface';
import { IJoinRequest } from './interface/group.join.request.interface';
import { IFile } from './interface/file.interface';
import { ElasticsearchService } from '@nestjs/elasticsearch/dist';
import { IGroupIndexBody } from './interface/es.group.data.interface';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userGroupRepository: UserGroupRepository,
    private readonly tagRepository: TagRepository,
    private readonly tagGroupRepository: TagGroupRepository,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  // 미가입 그룹 리스트
  async getAllGroupList(userId: number, page: number): Promise<IMapGroups[]> {
    const pageSize = 9;
    const foundUserWithGroups = await this.userGroupRepository.find({
      where: { userId },
    });

    let getGroupsWithOutIds;

    const groupIds = foundUserWithGroups.map((data) => data.groupId);
    if (groupIds.length === 0) {
      getGroupsWithOutIds = await this.groupRepository.getAllGroupList(
        page,
        pageSize,
      );
    } else {
      getGroupsWithOutIds = await this.groupRepository.getGroupsWithOutIds(
        groupIds,
        page,
        pageSize,
      );
    }

    const mapGroupList = await this.mapGroupsWithTags(getGroupsWithOutIds);
    return mapGroupList;
  }

  // 가입 신청 그룹 리스트
  async getGroupJoinList(userId: number, page: number): Promise<IMapGroups[]> {
    const pageSize = 9;
    const foundUserWithGroups = await this.userGroupRepository.find({
      where: { userId, role: '가입대기' },
    });

    const groupIds = foundUserWithGroups.map((data) => data.groupId);
    if (groupIds.length === 0) return [];
    const getGroupsWithOutIds = await this.groupRepository.getGroupJoinList(
      groupIds,
      page,
      pageSize,
    );
    const mapGroupList = this.mapGroupsWithTags(getGroupsWithOutIds);

    return mapGroupList;
  }

  // 그룹 태그 검색 리스트
  async searchGroupByTag(tag: string, page: number): Promise<IMapGroups[]> {
    const searchGroupWithTag = this.searchGroupWithTag(tag, page);
    const groupIds = (await searchGroupWithTag).map(
      (groupId) => groupId._source,
    );
    if (groupIds.length === 0) {
      throw new NotFoundException('존재하지 않는 태그입니다.');
    }

    const resultGroupIds = Array.from(
      new Set(groupIds.map((item) => item['id'])),
    );

    const getGroupsWithIds = await this.groupRepository.getGroupsWithIds(
      resultGroupIds,
    );
    const mapGroupList = this.mapGroupsWithTags(getGroupsWithIds);

    return mapGroupList;
  }

  // 소속된 그룹 리스트
  async getMyGroupList(userId: number, page: number): Promise<IMyGroupList[]> {
    const pageSize = 9;
    const myGroupList = await this.groupRepository.getMyGroupList(
      userId,
      page,
      pageSize,
    );
    const a =myGroupList.map((group) => ({
      groupId: group.id,
      groupName: group.groupName,
      groupImage: group.groupImage,
      backgroundImage: group.backgroundImage,
      description: group.description,
      leader: group.user.username,
      leaderImage: group.user.image,
    }));
    console.log(a)
    return a
  }

  // 그룹 관리 리스트
  async getGroupManagementList(userId: number, page: number): Promise<Group[]> {
    let pageSize = 9;
    
    return await this.groupRepository.find({
      where: { userGroups: { userId, role: '그룹장' } },
      select: ['id', 'groupName', 'groupImage', 'backgroundImage', 'description'],
      take: pageSize,
      skip: pageSize * (page - 1),
    });
  }

  // 그룹 멤버 리스트
  async getGroupMemberList(groupId: number): Promise<IMemberList> {
    const foundGroup = await this.groupRepository.foundGroupByGroupId(groupId);
    const tags = foundGroup.tagGroups.map((tag) => tag.tag.tagName);
    const memberList = await this.userGroupRepository.getMemberList(groupId);
    const mapMemberList = memberList.map((data) => ({
      userId: data.userId,
      groupId: data.groupId,
      userName: data.user.username,
      userEmail: data.user.email,
      userImage: data.user.image,
      userRole: data.role,
    }));
    return { members: mapMemberList, foundGroup, tags };
  }

  // 그룹 가입 신청자 리스트
  async getGroupJoinRequestList(
    userId: number,
    groupId: number,
  ): Promise<IJoinRequest[]> {
    await this.checkGroupLeader(userId, groupId);
    const groupJoinRequestList =
      await this.userGroupRepository.getGroupJoinRequestList(groupId);

    return groupJoinRequestList.map((data) => ({
      userId: data.userId,
      groupId: data.groupId,
      userName: data.user.username,
      userEmail: data.user.email,
      userImage: data.user.image,
    }));
  }

  // 그룹 생성
  async createGroup(
    file: IFile,
    data: CreateGroupDto,
    userId: number,
  ): Promise<void> {
    const tagArray = data.tag.split(',');
    if (tagArray.find((tag) => tag.length >= 11)) {
      throw new BadRequestException(
        '태그의 길이는 11글자를 넘어갈 수 없습니다.',
      );
    }
    if (tagArray.length >= 4) {
      throw new BadRequestException('그룹 태그는 3개만 넣을 수 있습니다.');
    }

    let groupImage = '11.png';
    let backgroundImage = '1.png';

    if (file.groupImage) {
      groupImage = file.groupImage[0].key;
    }
    if (file.backgroundImage) {
      backgroundImage = file.backgroundImage[0].key;
    }

    const group = this.groupRepository.create({
      groupName: data.groupName,
      description: data.description,
      groupImage,
      backgroundImage,
      user: { id: userId },
    });
    await this.groupRepository.save(group);

    this.createIndexGroup(group, data.tag);

    if (tagArray.length > 0 && tagArray[0] !== '') {
      await this.checkTag(tagArray, group.id);
    }

    await this.userGroupRepository.insert({
      groupId: group.id,
      userId,
      role: '그룹장',
    });
  }

  // 그룹 수정
  async modifyGroup(
    data: ModifyGroupDto,
    file: IFile,
    userId: number,
    groupId: number,
  ): Promise<void> {
    const tagArray = data.tag.split(',');
    if (tagArray.find((tag) => tag.length >= 11)) {
      throw new BadRequestException(
        '태그의 길이는 11글자를 넘어갈 수 없습니다.',
      );
    }
    if (tagArray.length >= 4) {
      throw new BadRequestException('그룹 태그는 3개만 넣을 수 있습니다.');
    }

    const foundGroup = await this.groupRepository.findOneBy({
      id: groupId,
      user: { id: userId },
    });

    if (!foundGroup) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    }
    if (file.groupImage) {
      data.groupImage = file.groupImage[0].key;
    }

    if (file.backgroundImage) {
      data.backgroundImage = file.backgroundImage[0].key;
    }

    const groupIndexId = await this.findIndexGroup(foundGroup.id);
    await this.updateIndexGroup(groupIndexId, data, foundGroup.id);
    await this.tagGroupRepository.delete({ groupId });

    await this.checkTag(tagArray, groupId);
    const updateGroupInfo = await this.groupRepository.update(groupId, {
      groupName: data.groupName,
      description: data.description,
      groupImage: data.groupImage,
      backgroundImage: data.backgroundImage,
    });
  }

  // 그룹 삭제
  async deleteGroup(userId: number, groupId: number): Promise<void> {
    const deletedGroup = await this.groupRepository.softDelete({
      id: groupId,
      user: { id: userId },
    });
    if (deletedGroup.affected === 0) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    }
    await this.userGroupRepository.delete({
      groupId,
    });

    const groupIndexId = await this.findIndexGroup(groupId);
    await this.deleteIndexGroup(groupIndexId);
  }

  // 그룹 양도
  async transferGroupOwnership(
    userId: number,
    ids: IGroupWithMemberIdsStr,
  ): Promise<void> {
    const groupId = Number(ids.groupId);
    const memberId = Number(ids.memberId);
    const foundUser = await this.userGroupRepository.findOne({
      where: { userId: memberId, groupId, role: '회원' },
    });
    if (!foundUser) {
      throw new BadRequestException('그룹원에게만 양도할 수 있습니다.');
    }
    await this.checkGroupLeader(userId, groupId);

    await this.groupRepository.update(groupId, {
      user: { id: memberId },
    });
    await this.userGroupRepository.update(
      { userId, groupId },
      { role: '회원' },
    );
    await this.userGroupRepository.update(
      { userId: memberId, groupId },
      { role: '그룹장' },
    );
  }

  // 그룹 추방
  async removeGroupMember(
    userId: number,
    ids: IGroupWithMemberIdsStr,
  ): Promise<void> {
    const groupId = Number(ids.groupId);
    const memberId = Number(ids.memberId);

    await this.checkGroupLeader(userId, groupId);

    const foundUser = await this.userGroupRepository.findOne({
      where: { userId: memberId, groupId, role: '회원' },
    });

    if (!foundUser) {
      throw new BadRequestException('존재하지 않는 회원입니다.');
    }

    await this.userGroupRepository.delete({
      groupId,
      userId: memberId,
      role: '회원',
    });
  }

  // 그룹 가입 신청 수락
  async acceptGroupJoinRequest(
    userId: number,
    ids: IGroupWithMemberIdsStr,
  ): Promise<void> {
    const groupId = Number(ids.groupId);
    const memberId = Number(ids.memberId);

    await this.checkGroupLeader(userId, groupId);
    const foundUserWithGroup = await this.userGroupRepository.findOneBy({
      userId: memberId,
      groupId,
    });

    if (!foundUserWithGroup || foundUserWithGroup.role !== '가입대기') {
      throw new BadRequestException('가입대기 상태만 수락할 수 있습니다.');
    }
    await this.userGroupRepository.update(
      { userId: memberId, groupId },
      { role: '회원' },
    );
  }

  // 그룹 가입 거절
  async rejectGroupJoinRequest(
    userId: number,
    ids: IGroupWithMemberIdsStr,
  ): Promise<void> {
    const groupId = Number(ids.groupId);
    const memberId = Number(ids.memberId);
    await this.checkGroupLeader(userId, groupId);
    this.userGroupRepository.delete({
      userId: memberId,
      groupId,
      role: '가입대기',
    });
  }

  // 그룹 가입 신청
  async addGroupJoinRequest(userId: number, groupId: number): Promise<void> {
    const foundUserWithGroup = await this.userGroupRepository.findOneBy({
      userId,
      groupId,
    });
    if (!foundUserWithGroup) {
      await this.userGroupRepository.insert({
        userId,
        groupId,
        role: '가입대기',
      });
    }
  }

  // 그룹 탈퇴
  async leaveGroup(userId: number, groupId: number): Promise<void> {
    const foundUser = await this.userGroupRepository.findOne({
      where: { userId, groupId },
    });
    if (!foundUser) {
      throw new BadRequestException(
        '존재하지 않는 그룹이거나 가입되어 있지 않습니다.',
      );
    }

    if (foundUser.role === '그룹장') {
      throw new BadRequestException('그룹장을 양도해주세요.');
    }

    await this.userGroupRepository.delete({
      userId,
      groupId,
    });
  }

  // 그룹 리스트 태그 매핑
  async mapGroupsWithTags(groupList: Group[]): Promise<IMapGroups[]> {
    const mapGroupList = groupList.map((group) => {
      const mapTagGroups = group.tagGroups.map((tag) => tag.tag.tagName);

      return {
        id: group.id,
        groupName: group.groupName,
        groupImage: group.groupImage,
        backgroundImage: group.backgroundImage,
        description: group.description,
        tagGroups: mapTagGroups,
      };
    });
    return mapGroupList;
  }

  // 태그 체크
  async checkTag(tags: string[], groupId: number): Promise<void> {
    if (!tags.length) {
      return;
    }

    const existTags = await this.tagRepository.foundTags(tags);
    const existTagNames = existTags.map((tag) => tag.tagName);
    const newTags = tags.filter((tag) => !existTagNames.includes(tag));
    const newTagNames = newTags.map((tag) => ({ tagName: tag }));

    if (newTags.length !== 0) {
      const createTags = await this.tagRepository.createTags(newTagNames);
      const mapTags = createTags.identifiers.map((tag) => ({
        tagId: tag.id,
        groupId,
      }));
      this.tagGroupRepository.createTagWithGroup(mapTags);
    }

    if (existTags.length !== 0) {
      const mapTags = existTags.map((tag) => ({
        tagId: tag.id,
        groupId,
      }));
      this.tagGroupRepository.createTagWithGroup(mapTags);
    }
  }

  // 그룹 리더 체크
  async checkGroupLeader(userId: number, groupId: number): Promise<void> {
    const checkLeader = await this.groupRepository.foundGroupWithLeader(
      groupId,
    );

    if (checkLeader.user.id !== userId)
      throw new ForbiddenException('권한이 존재하지 않습니다.');
  }

  // ES 인덱스 생성
  async createIndex(indexName: string): Promise<void> {
    await this.elasticsearchService.indices.create({
      index: indexName,
    });
  }

  // ES 그룹 인덱스 문서 추가
  async createIndexGroup(group: IGroupIndexBody, tag: string): Promise<void> {
    if (tag === '') {
      tag = '전체';
    }
    await this.elasticsearchService.index({
      index: 'groups',
      body: {
        id: group.id,
        groupName: group.groupName,
        description: group.description,
        tag,
      },
    });
  }

  // ES 그룹 인덱스 문서 찾기
  async findIndexGroup(id): Promise<string> {
    const groupIndex = await this.elasticsearchService.search({
      index: 'groups',
      query: {
        match: {
          id,
        },
      },
    });
    return groupIndex.hits.hits[0]._id;
  }

  // ES 그룹 인덱스 문서 수정
  async updateIndexGroup(
    groupIndexId: string,
    data: IGroupIndexBody,
    groupId: number,
  ): Promise<void> {
    if (data.tag === '') {
      data.tag = '전체';
    }
    await this.elasticsearchService.index({
      index: 'groups',
      id: groupIndexId,
      body: {
        id: groupId,
        groupName: data.groupName,
        description: data.description,
        tag: data.tag,
      },
    });
  }

  // ES 그룹 인덱스 문서 삭제
  async deleteIndexGroup(groupIndexId: string): Promise<void> {
    await this.elasticsearchService.delete({
      index: 'groups',
      id: groupIndexId,
    });
  }

  // ES 그룹 검색
  async searchGroupWithTag(tag: string, page: number) {
    const pageSize = 9;
    const result = await this.elasticsearchService.search({
      index: 'groups',
      from: pageSize * (page - 1),
      size: pageSize,
      query: {
        query_string: {
          query: `*${tag}*`,
          fields: ['tag', 'description', 'groupName'],
        },
      },
      _source: ['id'],
    });
    return result.hits.hits;
  }
}
