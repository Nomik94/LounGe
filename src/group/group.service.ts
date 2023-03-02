import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/database/entities/group.entity';
import { TagGroup } from 'src/database/entities/tag-group.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create.group.dto';

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

  async createGroup(data: CreateGroupDto): Promise<void> {
    const group = await this.groupRepository.create({
      groupName: data.groupName,
      description: data.description,
      groupImage: data.groupImage,
      backgroundImage: data.backgroundImage,
      user: { id: 1 }, // entity에서 user을 객체로 받기 때문에 user : User => user : { id : 1 } 과 같은 형식으로 넣어준다? ?? User 클래스 안에 있는 id를 활용!
    });
    await this.groupRepository.save(group);

    await this.userGroupRepository.insert({
      groupId: group.id,
      userId: group.user.id,
    });
    for (const tag of data.tag) {
      const findTag = await this.tagRepository.findOneBy({ tagName: tag });
      if (!findTag) {
        const createTag = await this.tagRepository.create({ tagName: tag });
        await this.tagRepository.save(createTag);
        await this.tagGroupRepository.insert({
          tagId: createTag.id,
          groupId: group.id,
        });
      } else {
        const a = await this.tagGroupRepository.insert({
          tagId: findTag.id,
          groupId: group.id,
        });
      }
    }

    // 아래와 같은 방법으로 입력받은 태그를 테이블에 중복 없이 넣어줄 수 있음 하지만 pk를 가진 id가 넣어주지 않을때에도 계속 증가됨
    // 효율적인 면에서 DB를 계속 찾아봐야하는 위의 방법보다 좋다고 생각함
    // for (const tag of data.tag) {
    //   try {
    //     await this.tagRepository.insert({ tagName: tag });
    //   } catch {}
    // }
  }
}
