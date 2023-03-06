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
import { Like, Not, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create.group.dto';
import { ModifyGroupDto } from './dto/modify.group.dto';

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

  async createGroup(data: CreateGroupDto, userId: number): Promise<void> {
    const group = await this.groupRepository.create({
      groupName: data.groupName,
      description: data.description,
      groupImage: data.groupImage,
      backgroundImage: data.backgroundImage,
      user: { id: userId }, // entity에서 user을 객체로 받기 때문에 user : User => user : { id : 1 } 과 같은 형식으로 넣어준다? ?? User 클래스 안에 있는 id를 활용!
    });
    await this.groupRepository.save(group);
    await this.tagCheck(data.tag, group.id);
    await this.userGroupRepository.insert({
      groupId: group.id,
      userId,
      role: '그룹장',
    });
  }

  async getAllGroup(userId: number) {
    const groupList = await this.groupRepository.find({
      select: ['id', 'groupName', 'groupImage', 'backgroundImage'],
      relations: ['tagGroups.tag', 'userGroups'],
      where: { userGroups: { userId: Not(userId) } },
    });

    const resultGroupList = this.tagMappingGroups(groupList);
    return resultGroupList;
  }

  async modifyGruop(data: ModifyGroupDto, userId: number, groupId: number) {
    const findGroup = await this.groupRepository.findOneBy({
      id: groupId,
      user: { id: userId },
    });
    if (!findGroup) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    }
    await this.groupRepository.update(groupId, data);
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
    const adminCheckResult = await this.userGroupRepository.findOneBy({
      userId,
      groupId: Number(ids.groupId),
      role: '그룹장',
    });
    if (!adminCheckResult) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    }
    const joinGroupMember = await this.userGroupRepository.findOneBy({
      userId: Number(ids.memberId),
      groupId: Number(ids.groupId),
    });

    if (joinGroupMember.role !== '가입대기') {
      throw new BadRequestException('가입대기 상태만 수락할 수 있습니다.');
    }
    await this.userGroupRepository.update(
      { userId: Number(ids.memberId), groupId: Number(ids.groupId) },
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
      select: ['id', 'groupName', 'groupImage', 'backgroundImage'],
      relations: ['tagGroups.tag'],
      where: groupIds,
    });

    const resultGroupList = this.tagMappingGroups(findGroups);

    return resultGroupList;
  }

  async tagMappingGroups(groupList) {
    const modifiedGroupList = groupList.map((group) => {
      const TagGroups = [];
      group.tagGroups.forEach((tag) => {
        TagGroups.push(tag.tag.tagName);
      });

      return {
        id: group.id,
        groupName: group.groupName,
        groupImage: group.groupImage,
        backgroundImage: group.backgroundImage,
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
}
