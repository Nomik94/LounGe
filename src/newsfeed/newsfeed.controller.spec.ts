import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { NewsfeedService } from './newsfeed.service';
import { newsfeedCheckDto } from './dto/newsfeed.check.dto';
import * as request from 'supertest';

describe('NewsfeedController (e2e)', () => {
  let app: INestApplication;
  let newsfeedService: NewsfeedService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    newsfeedService = moduleFixture.get<NewsfeedService>(NewsfeedService);
  });

  describe('POST /api/newsfeed/newsfeed', () => {
    it('should return 201 status code', async () => {
      const newsfeedData: newsfeedCheckDto = {
        content: '테스트',
        userId: 1,
        tag: '테스트',
        image: '테스트',
      };

      jest.spyOn(newsfeedService, 'createNewsfeed').mockResolvedValue();

      const res = await request(app.getHttpServer())
        .post('/api/newsfeed/newsfeed')
        .send(newsfeedData)
        .expect(201);

      expect(res.body).toEqual({});
    });

    it('should call newsfeedService.createNewsfeed method with correct data', async () => {
      const newsfeedData: newsfeedCheckDto = {
        content: '테스트',
        userId: 1,
        tag: '테스트',
        image: '테스트',
      };

      const createNewsfeedSpy = jest.spyOn(newsfeedService, 'createNewsfeed');

      await request(app.getHttpServer())
        .post('/api/newsfeed/newsfeed')
        .send(newsfeedData)
        .expect(201);

      expect(createNewsfeedSpy).toHaveBeenCalledWith(newsfeedData);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
