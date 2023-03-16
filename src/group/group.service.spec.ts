import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Group } from 'src/database/entities/group.entity';
import { GroupService } from './group.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { TagGroup } from 'src/database/entities/tag-group.entity';

const mockGroupRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});
const mockUserGroupRepository = () => ({
  insert: jest.fn(),
});
const mockTagRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});
const mockTagGroupRepository = () => ({
  insert: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('GroupService', () => {
  let service: GroupService;
  let groupRepository: MockRepository<Group>;
  let userGroupRepository: MockRepository<UserGroup>;
  let tagRepository: MockRepository<Tag>;
  let tagGroupRepository: MockRepository<TagGroup>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getRepositoryToken(Group),
          useValue: mockGroupRepository(),
        },
        {
          provide: getRepositoryToken(UserGroup),
          useValue: mockUserGroupRepository(),
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: mockTagRepository(),
        },
        {
          provide: getRepositoryToken(TagGroup),
          useValue: mockTagGroupRepository(),
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    groupRepository = module.get(getRepositoryToken(Group));
    userGroupRepository = module.get(getRepositoryToken(UserGroup));
    tagRepository = module.get(getRepositoryToken(Tag));
    tagGroupRepository = module.get(getRepositoryToken(TagGroup));
  });

  it('createGroup', async () => {
    const userId = 1;
    const data = {
      groupName: '스파르타',
      description: '내일배움캠프 4기 모여라',
      groupImage: 'image',
      backgroundImage: 'image',
      tag: ['개발자', '코딩', '노드'],
    };
    const group = { id: 1, user: { id: userId } };
    const createTag = { id: 1 };
    const groupRepositoryCreate = {
      groupName: data.groupName,
      description: data.description,
      groupImage: data.groupImage,
      backgroundImage: data.backgroundImage,
      user: { id: userId },
    };
    const count = data.tag.length
    groupRepository.create.mockResolvedValue(group);

    tagRepository.create.mockResolvedValue(createTag);

    await service.createGroup(data);
    // groupRepository.create 의 입력받는 인자는 groupRepositoryCreate 이다.
    // groupRepository.create 를 한번 호출한다.
    // groupRepository.save 는 create의 리턴 값을 인자로 받는다.
    // groupRepository.save 를 한번 호출한다.
    expect(groupRepository.create).toHaveBeenCalledWith(groupRepositoryCreate);
    expect(groupRepository.create).toHaveBeenCalledTimes(1);
    expect(groupRepository.save).toHaveBeenCalledWith(group);
    expect(groupRepository.save).toHaveBeenCalledTimes(1);

    // userGroupRepository.insert 를 한번 호출한다. 입력받는 값은 {groupId,userId}이다. 
    expect(userGroupRepository.insert).toHaveBeenCalledWith({groupId : group.id, userId : group.user.id});
    expect(userGroupRepository.insert).toHaveBeenCalledTimes(1);

    expect(tagRepository.findOneBy).toHaveBeenCalledTimes(count);
  });
});
