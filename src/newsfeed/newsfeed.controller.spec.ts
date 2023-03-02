import { Test, TestingModule } from '@nestjs/testing';
import { NewsfeedController } from './newsfeed.controller';
import { NewsfeedRepository, NewsfeedService } from './newsfeed.service';

describe('NewsfeedController', () => {
  let controller: NewsfeedController;
  let service: NewsfeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsfeedController],
      providers: [NewsfeedService,NewsfeedRepository]
    }).compile();

    controller = module.get<NewsfeedController>(NewsfeedController);
    service = module.get<NewsfeedService>(NewsfeedService);
  });

  describe('newsfeed', () => {
    it('newsfeed', async () => {
      const test = {content: '테스트코드', userId: 1, tag: '여름', image: '이미지링크'};
      const test2 = jest.spyOn(service,'postnewsfeed').mockResolvedValue(test)
      expect(await controller.postnewsfeed('테스트코드',1,"여름","이미지링크")).toStrictEqual(test)
      expect(test2).toBeCalledTimes(1)
    })
  })

});
