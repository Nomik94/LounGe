import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/database/entities/group.entity';
import { TagGroup } from 'src/database/entities/tag-group.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { In, Like, Not, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create.group.dto';
import { ModifyGroupDto } from './dto/modify.group.dto';
import { GroupTransfer } from './interface/transfer.group.interface';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(TagGroup)
    private readonly tagGroupRepository: Repository<TagGroup>,
  ) {}

  // 전체 그룹 리스트
  async getAllGroupList(userId: number) {
    const foundUserWithGroups = await this.userGroupRepository.find({
      where: { userId },
    });

    const groupIds = foundUserWithGroups.map((data) => data.groupId);
    const groupsWithoutTag = await this.groupRepository.find({
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

    const mapGroupList = this.mapGroupsWithTags(groupsWithoutTag);

    return mapGroupList;
  }

  // 그룹 태그 검색 리스트
  async searchGroupByTag(tag) {
    const tags = await this.tagRepository.find({
      where: { tagName: Like(`%${tag}%`) },
      select: ['id'],
    });

    if (tags.length === 0) {
      throw new BadRequestException('존재하지 않는 태그입니다.');
    }
    const tagIds = tags.map((tag) => ({ tagId: tag.id }));

    const foundTagWithGroups = await this.tagGroupRepository.find({
      where: tagIds,
    });

    const groupIds = foundTagWithGroups.map((tagGroup) => ({
      id: tagGroup.groupId,
    }));

    const foundGroups = await this.groupRepository.find({
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

    const mapGroupList = this.mapGroupsWithTags(foundGroups);

    return mapGroupList;
  }

  // 소속된 그룹 리스트
  async getMyGroupList(userId) {
    const myGroupList = await this.groupRepository.find({
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

    return myGroupList.map((group) => ({
      groupId: group.id,
      groupName: group.groupName,
      groupImage: group.groupImage,
      backgroundImage: group.backgroundImage,
      description: group.description,
      leader: group.user.username,
      leaderImage: group.user.image,
    }));
  }

  // 그룹 관리 리스트
  async getGroupManagementList(userId) {
    return await this.groupRepository.find({
      where: { userGroups: { userId, role: '그룹장' } },
    });
  }

  // 그룹 멤버 리스트
  async getGroupMemberList(groupId) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['tagGroups.tag'],
    });

    const tags = group.tagGroups.map((tag) => tag.tag.tagName);
    const memberList = await this.userGroupRepository.find({
      where: { groupId, role: Not('가입대기') },
      relations: ['user'],
      order: { role: 'ASC' },
    });
    const mapMemberList = memberList.map((data) => ({
      userId: data.userId,
      groupId: data.groupId,
      userName: data.user.username,
      userEmail: data.user.email,
      userImage: data.user.image,
      userRole: data.role,
    }));
    return { members: mapMemberList, group, tags };
  }

  // 그룹 가입 신청자 리스트
  async getGroupJoinRequestList(userId, groupId) {
    await this.checkGroupLeader(userId, groupId);
    const groupJoinRequestList = await this.userGroupRepository.find({
      where: { groupId, role: '가입대기' },
      select: ['userId', 'groupId'],
      relations: ['user'],
    });

    return groupJoinRequestList.map((data) => ({
      userId: data.userId,
      groupId: data.groupId,
      userName: data.user.username,
      userEmail: data.user.email,
      userImage: data.user.image,
    }));
  }

  // 그룹 생성
  async createGroup(file, data: CreateGroupDto, userId: number): Promise<void> {
    const tagArray = data.tag.split(',');
    if (tagArray.find((tag) => tag.length >= 11)) {
      throw new BadRequestException(
        '태그의 길이는 11글자를 넘어갈 수 없습니다.',
      );
    }
    if (tagArray.length >= 4) {
      throw new BadRequestException('그룹 태그는 3개만 넣을 수 있습니다.');
    }

    let groupImage = '1.png';
    let backgroundImage = '1.png';

    if (file.groupImage) {
      groupImage = file.groupImage[0].filename;
    }
    if (file.backgroundImage) {
      backgroundImage = file.backgroundImage[0].filename;
    }

    const group = this.groupRepository.create({
      groupName: data.groupName,
      description: data.description,
      groupImage,
      backgroundImage,
      user: { id: userId },
    });
    await this.groupRepository.save(group);

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
    file,
    userId: number,
    groupId: number,
  ) {
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
      data.groupImage = file.groupImage[0].filename;
    }

    if (file.backgroundImage) {
      data.backgroundImage = file.backgroundImage[0].filename;
    }

    await this.tagGroupRepository.delete({ groupId });

    await this.checkTag(tagArray, groupId);

    await this.groupRepository.update(groupId, {
      groupName: data.groupName,
      description: data.description,
      groupImage: data.groupImage,
      backgroundImage: data.backgroundImage,
    });
  }

  // 그룹 삭제
  async deleteGroup(userId: number, groupId: number) {
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
  }

  // 그룹 양도
  async transferGroupOwnership(userId: number, ids: GroupTransfer) {
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
  async removeGroupMember(userId, ids: GroupTransfer) {
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
  async acceptGroupJoinRequest(userId: number, ids) {
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
  async rejectGroupJoinRequest(userId: number, ids: GroupTransfer) {
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
  async addGroupJoinRequest(userId: number, groupId: number) {
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
  async leaveGroup(userId, groupId) {
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
  async mapGroupsWithTags(groupList) {
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
  async checkTag(tags: string[], groupId: number) {
    if (!tags.length) {
      return;
    }

    const existTags = await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.tagName IN (:...tags)', { tags })
      .getMany();

    const existTagNames = existTags.map((tag) => tag.tagName);
    const newTags = tags.filter((tag) => !existTagNames.includes(tag));

    if (newTags.length !== 0) {
      const createdTags = await this.tagRepository
        .createQueryBuilder()
        .insert()
        .into(Tag)
        .values(newTags.map((tag) => ({ tagName: tag })))
        .execute();

      await this.tagGroupRepository
        .createQueryBuilder()
        .insert()
        .into(TagGroup)
        .values(
          createdTags.identifiers.map((tag) => ({ tagId: tag.id, groupId })),
        )
        .execute();
    }

    if (existTags.length !== 0) {
      await this.tagGroupRepository
        .createQueryBuilder()
        .insert()
        .into(TagGroup)
        .values(existTags.map((tag) => ({ tagId: tag.id, groupId })))
        .execute();
    }
  }

  // 그룹 리더 체크
  async checkGroupLeader(userId: number, groupId: number) {
    const checkLeader = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['user'],
    });

    if (checkLeader.user.id !== userId)
      throw new ForbiddenException('권한이 존재하지 않습니다.');
  }
}
