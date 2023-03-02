import { Test, TestingModule } from '@nestjs/testing';
import { CreateGroupDto } from './dto/create.group.dto';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

describe('GroupController', () => {
  let controller: GroupController;
  let service : GroupService;

  beforeEach(async () => {
    const MockService = {
      provide: GroupService,
      useFactory: () => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        createGroup: jest.fn(() => {}),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers : [GroupService,MockService]
    }).compile();
    service = module.get<GroupService>(GroupService)
    controller = module.get<GroupController>(GroupController);
  });

  describe('createGroup', () => {
    it('createGroup', async () => {
      const data : CreateGroupDto = {
        groupName : "스파르타",
        description : "내일배움캠프 4기 모여라",
        groupImage : "image",
        backgroundImage : "image",
        tag : ["개발자"]
      }

      controller.createGroup(data);
      expect(service.createGroup).toBeCalledTimes(1);
    });
  });
});
