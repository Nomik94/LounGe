import { Test, TestingModule } from '@nestjs/testing';
import { NewsfeedService } from './newsfeed.service';
import { NewsfeedRepository } from './newsfeed.service';

describe('NewsfeedService', () => {
  let service: NewsfeedService;
  let repository: NewsfeedRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsfeedService,NewsfeedRepository],
    }).compile();

    service = module.get<NewsfeedService>(NewsfeedService);
    repository = module.get<NewsfeedRepository>(NewsfeedRepository)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('newsfeed', () => {
    it('should call repository', async () => {
      const test = {content:"테스트코드",userId:1,tag:"여름",image:"이미지링크"};
      // const test2 = jest.spyOn(repository, 'findOne').mockResolvedValue(test);
      // expect(test2).toBeCalledWith(1);
      expect(await service.postnewsfeed('테스트코드',1,"여름","이미지링크")).toStrictEqual(test)
    })
  })
});

