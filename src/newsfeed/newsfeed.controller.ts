import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { newsfeedCheckDto } from './dto/newsfeed-check.dto';
import { NewsfeedService } from './newsfeed.service';

@Controller('api/newsfeed')
export class NewsfeedController {
  constructor(private readonly newsfeedService: NewsfeedService) {}

  // 뉴스피드 작성
  @Post('newsfeed')
  async postnewsfeed(@Body() data: newsfeedCheckDto): Promise<void> {
    return await this.newsfeedService.postnewsfeed(data);
  }

  // 뉴스피드 읽기
  @Get('newsfeed/:id')
  async readnewsfeed(@Param('id') userId: number) {
    return await this.newsfeedService.readnewsfeed(userId);
  }
}
