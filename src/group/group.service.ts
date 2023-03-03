import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/database/entities/group.entity';
import { TagGroup } from 'src/database/entities/tag-group.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { Not, Repository } from 'typeorm';
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

    // 아래와 같은 방법으로 입력받은 태그를 테이블에 중복 없이 넣어줄 수 있음 하지만 pk를 가진 id가 넣어주지 않을때에도 계속 증가됨
    // 효율적인 면에서 DB를 계속 찾아봐야하는 위의 방법보다 좋다고 생각함
    // for (const tag of data.tag) {
    //   try {
    //     await this.tagRepository.insert({ tagName: tag });
    //   } catch {}
    // }
  }

  async getAllGroup(userId: number) {
    const groupList = await this.groupRepository.find({
      select: ['id', 'groupName', 'groupImage', 'backgroundImage'],
      relations: ['tagGroups.tag'],
      where: { userGroups: { userId: Not(userId) } }, // 가입한 그룹은 보여주지 않기 위해서 추가
    });
    const modifiedGroupList = groupList.map((group) => {
      const TagGroups = [];
      group.tagGroups.forEach((tag) => {
        TagGroups.push(tag.tag.tagName);
      });

      return {
        id: 1,
        groupName: group.id,
        groupImage: group.groupName,
        backgroundImage: group.backgroundImage,
        tagGroups: TagGroups,
      };
    });
    return modifiedGroupList;
  }

  async modifyGruop(data: ModifyGroupDto, userId: number, groupId: number) {
    const findGroup = await this.groupRepository.findOneBy({
      id: groupId,
      user: { id: userId },
    });
    if (!findGroup) {
      throw new ForbiddenException('권한이 존재하지 않습니다.')
    }
    await this.groupRepository.update(groupId, data);
  }

  async tagCheck(tags: string[], groupId: number) {
    if(!tags.length){
      return
    }
    tags.forEach(async (tag) => {
      const findTag = await this.tagRepository.findOneBy({ tagName: tag });
      if (!findTag) {
        const createTag = await this.tagRepository.create({ tagName: tag });
        await this.tagRepository.save(createTag);
        await this.tagGroupRepository.insert({
          tagId: createTag.id,
          groupId,
        });
      } else {
        await this.tagGroupRepository.insert({
          tagId: findTag.id,
          groupId,
        });
      }
    });
  }
}
