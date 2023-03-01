import { Test, TestingModule } from '@nestjs/testing';
import { NewsfeedController } from './newsfeed.controller';
import { NewsfeedService } from './newsfeed.service';

describe('NewsfeedController', () => {
  let controller: NewsfeedController;
  let service: NewsfeedService;

  beforeEach(async () => {
    const testNewsfeed = {
      provide: NewsfeedService,
      useFactory: () => ({
        newsfeed: jest.fn(() => {}),
      }),
    };


    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsfeedController],
      providers: [NewsfeedService,testNewsfeed]
    }).compile();

    controller = module.get<NewsfeedController>(NewsfeedController);
    service = module.get<NewsfeedService>(NewsfeedService);
  });

  describe('newsfeed', () => {
    it('newsfeed', async () => {
      
      const test = {content: '테스트코드', userId: 1234, tag: '여름', image: '이미지링크'};
      controller.postnewsfeed(test)
      expect(service.postnewsfeed).toBeCalledTimes(1)
    })
  })

});
