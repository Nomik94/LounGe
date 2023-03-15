import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsfeedService } from './newsfeed.service';
import { NewsFeed } from '../database/entities/newsFeed.entity';
import { NewsFeedTag } from '../database/entities/newsFeed-Tag.entity';
import { NewsFeedImage } from '../database/entities/newsFeedImage.entity';
import { Tag } from '../database/entities/tag.entity';
import { newsfeedCheckDto } from './dto/newsfeed-check.dto';

describe('NewsfeedService', () => {
  let newsfeedService: NewsfeedService;
  let newsfeedRepository: Repository<NewsFeed>;
  let tagRepository: Repository<Tag>;
  let newsfeedTagRepository: Repository<NewsFeedTag>;
  let newsfeedImageRepository: Repository<NewsFeedImage>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NewsfeedService,
        {
          provide: getRepositoryToken(NewsFeed),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(NewsFeedTag),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(NewsFeedImage),
          useClass: Repository,
        },
      ],
    }).compile();

    newsfeedService = moduleRef.get<NewsfeedService>(NewsfeedService);
    newsfeedRepository = moduleRef.get<Repository<NewsFeed>>(
      getRepositoryToken(NewsFeed),
    );
    tagRepository = moduleRef.get<Repository<Tag>>(getRepositoryToken(Tag));
    newsfeedTagRepository = moduleRef.get<Repository<NewsFeedTag>>(
      getRepositoryToken(NewsFeedTag),
    );
    newsfeedImageRepository = moduleRef.get<Repository<NewsFeedImage>>(
      getRepositoryToken(NewsFeedImage),
    );
  });

  describe('createNewsfeed', () => {
    it('should create a newsfeed successfully', async () => {
      const newsfeed = {
        content: "테스트",
           userId: 1,
           tag:"테스트",
          image:"테스트"
      } as newsfeedCheckDto;

      const newsfeedSaveSpy = jest.spyOn(newsfeedRepository, 'save');
      const tagFindOneBySpy = jest.spyOn(tagRepository, 'findOneBy');
      const tagInsertSpy = jest.spyOn(tagRepository, 'insert');
      const newsfeedImageSaveSpy = jest.spyOn(
        newsfeedImageRepository,
        'save',
      );
      const tagFindOneSpy = jest.spyOn(tagRepository, 'findOne');
      const newsfeedTagSaveSpy = jest.spyOn(newsfeedTagRepository, 'save');

      await newsfeedService.createNewsfeed(newsfeed);

      expect(newsfeedSaveSpy).toBeCalledTimes(1);
      expect(tagFindOneBySpy).toBeCalledTimes(2);
      expect(tagInsertSpy).toBeCalledTimes(2);
      expect(newsfeedImageSaveSpy).toBeCalledTimes(1);
      expect(tagFindOneSpy).toBeCalledTimes(2);
      expect(newsfeedTagSaveSpy).toBeCalledTimes(2);
    });
  });
});
