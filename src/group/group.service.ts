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
import { GroupTransfer } from './interface/group.transfer.interface';

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

  async createGroup(file, data: CreateGroupDto, userId: number): Promise<void> {
    const tagArray = await data.tag.split(',');
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

    const group = await this.groupRepository.create({
      groupName: data.groupName,
      description: data.description,
      groupImage,
      backgroundImage,
      user: { id: userId }, // entity에서 user을 객체로 받기 때문에 user : User => user : { id : 1 } 과 같은 형식으로 넣어준다? ?? User 클래스 안에 있는 id를 활용!
    });
    await this.groupRepository.save(group);
    if (tagArray.length > 0 && tagArray[0] !== '') {
      await this.tagCheck(tagArray, group.id);
    }
    await this.userGroupRepository.insert({
      groupId: group.id,
      userId,
      role: '그룹장',
    });
  }

  async getAllGroup(userId: number) {
    const joinGroupIds = await this.userGroupRepository.find({
      where: { userId },
    });

    const groupIds = joinGroupIds.map((data) => data.groupId);
    const groupList = await this.groupRepository.find({
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

    const resultGroupList = this.tagMappingGroups(groupList);
    return resultGroupList;
  }

  async modifyGruop(
    data: ModifyGroupDto,
    file,
    userId: number,
    groupId: number,
  ) {
    const tagArray = await data.tag.split(',');
    if (tagArray.find((tag) => tag.length >= 11)) {
      throw new BadRequestException(
        '태그의 길이는 11글자를 넘어갈 수 없습니다.',
      );
    }
    if (tagArray.length >= 4) {
      throw new BadRequestException('그룹 태그는 3개만 넣을 수 있습니다.');
    }

    const findGroup = await this.groupRepository.findOneBy({
      id: groupId,
      user: { id: userId },
    });
    if (!findGroup) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    }
    console.log(file);
    if (file.groupImage) {
      data.groupImage = file.groupImage[0].filename;
    }
    if (file.backgroundImage) {
      data.backgroundImage = file.backgroundImage[0].filename;
    }
    await this.tagGroupRepository.delete({ groupId });
    this.tagCheck(tagArray, groupId);
    await this.groupRepository.update(groupId, {
      groupName: data.groupName,
      description: data.description,
      groupImage: data.groupImage,
      backgroundImage: data.backgroundImage,
    });
  }

  async deletedGroup(userId: number, groupId: number) {
    const deletedGroup = await this.groupRepository.softDelete({
      id: groupId,
      user: { id: userId },
    });
    if (deletedGroup.affected === 0) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    }
  }

  async sendGroupJoin(userId: number, groupId: number) {
    const joinedGroupStatus = await this.userGroupRepository.findOneBy({
      userId,
      groupId,
    });
    if (!joinedGroupStatus) {
      await this.userGroupRepository.insert({
        userId,
        groupId,
        role: '가입대기',
      });
    }
  }

  async acceptGroupJoin(userId: number, ids) {
    const groupId = Number(ids.groupId);
    const memberId = Number(ids.memberId);
    await this.groupLeaderCheck(userId, groupId);
    const joinGroupMember = await this.userGroupRepository.findOneBy({
      userId: memberId,
      groupId,
    });

    if (!joinGroupMember || joinGroupMember.role !== '가입대기') {
      throw new BadRequestException('가입대기 상태만 수락할 수 있습니다.');
    }
    await this.userGroupRepository.update(
      { userId: memberId, groupId },
      { role: '회원' },
    );
  }

  async findGroupsByTag(tag) {
    const findTag = await this.tagRepository.find({
      where: { tagName: Like(`%${tag}%`) },
      select: ['id'],
    });

    if (findTag.length === 0) {
      throw new BadRequestException('존재하지 않는 태그입니다.');
    }
    const tagIds = await findTag.map((tag) => ({ tagId: tag.id }));

    const findGroupIds = await this.tagGroupRepository.find({
      where: tagIds,
    });

    const groupIds = findGroupIds.map((tagGroup) => ({ id: tagGroup.groupId }));

    const findGroups = await this.groupRepository.find({
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

    const resultGroupList = this.tagMappingGroups(findGroups);

    return resultGroupList;
  }

  async withdrawalGroup(userId, groupId) {
    const findUser = await this.userGroupRepository.findOne({
      where: { userId, groupId },
    });
    if (!findUser) {
      throw new BadRequestException(
        '존재하지 않는 그룹이거나 가입되어 있지 않습니다.',
      );
    }

    if (findUser.role === '그룹장') {
      throw new BadRequestException('그룹장을 양도해주세요.');
    }

    await this.userGroupRepository.delete({
      userId,
      groupId,
    });
  }

  async createdGroupList(userId) {
    return await this.groupRepository.find({
      where: { userGroups: { userId, role: '그룹장' } },
    });
  }

  async joinedGroupList(userId) {
    const resultList = await this.groupRepository.find({
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

    return await resultList.map((group) => ({
      groupId: group.id,
      groupName: group.groupName,
      groupImage: group.groupImage,
      backgroundImage: group.backgroundImage,
      description: group.description,
      leader: group.user.username,
      leaderImage: group.user.image,
    }));
  }

  async groupApplicantList(userId, groupId) {
    await this.groupLeaderCheck(userId, groupId);
    const resultList = await this.userGroupRepository.find({
      where: { groupId, role: '가입대기' },
      select: ['userId', 'groupId'],
      relations: ['user'],
    });

    return await resultList.map((data) => ({
      userId: data.userId,
      groupId: data.groupId,
      userName: data.user.username,
      userEmail: data.user.email,
      userImage: data.user.image,
    }));
  }
  async groupMembers(groupId) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['tagGroups.tag'],
    });
    const tags = group.tagGroups.map((tag) => tag.tag.tagName);
    const resultList = await this.userGroupRepository.find({
      where: { groupId, role: Not('가입대기') },
      relations: ['user'],
      order: { role: 'ASC' },
    });
    const mappingList = await resultList.map((data) => ({
      userId: data.userId,
      groupId: data.groupId,
      userName: data.user.username,
      userEmail: data.user.email,
      userImage: data.user.image,
      userRole: data.role,
    }));
    return { members: mappingList, group, tags };
  }

  async groupTransfer(userId: number, ids: GroupTransfer) {
    const groupId = Number(ids.groupId);
    const memberId = Number(ids.memberId);
    const findUser = await this.userGroupRepository.findOne({
      where: { userId: memberId, groupId, role: '회원' },
    });
    if (!findUser) {
      throw new BadRequestException('그룹원에게만 양도할 수 있습니다.');
    }
    await this.groupLeaderCheck(userId, groupId);

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

  async kickOutGroup(userId, ids: GroupTransfer) {
    const groupId = Number(ids.groupId);
    const memberId = Number(ids.memberId);

    await this.groupLeaderCheck(userId, groupId);

    const findUser = await this.userGroupRepository.findOne({
      where: { userId: memberId, groupId, role: '회원' },
    });

    if (!findUser) {
      throw new BadRequestException('존재하지 않는 회원입니다.');
    }

    await this.userGroupRepository.delete({
      groupId,
      userId: memberId,
      role: '회원',
    });
  }
  async tagMappingGroups(groupList) {
    const modifiedGroupList = groupList.map((group) => {
      const TagGroups = group.tagGroups.map((tag) => tag.tag.tagName);

      return {
        id: group.id,
        groupName: group.groupName,
        groupImage: group.groupImage,
        backgroundImage: group.backgroundImage,
        description: group.description,
        tagGroups: TagGroups,
      };
    });
    return modifiedGroupList;
  }

  async tagCheck(tags: string[], groupId: number) {
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

  async groupLeaderCheck(userId: number, groupId: number) {
    const LeaderCheckResult = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['user'],
    });

    if (LeaderCheckResult.user.id !== userId)
      throw new ForbiddenException('권한이 존재하지 않습니다.');
  }
}
