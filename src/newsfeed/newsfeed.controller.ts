import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

<<<<<<< HEAD
  // 뉴스피드 읽기
  @Get('newsfeed/:id')
  async readnewsfeed(@Param('id') userId: number) {
    return await this.newsfeedService.readnewsfeed(userId);
  }
=======
    // 뉴스피드 읽기
    @Get('newsfeed/:id')
    async readnewsfeed(@Param('id') userId:number) {
        return await this.newsfeedService.readnewsfeed(userId)
    }

    // 뉴스피드 삭제
    @Delete('newsfeed/:newsfeedid')
    async deletenewsfeed(
        @Param('newsfeedid')newsfeedid:number
    ) {
        return await this.newsfeedService.deletenewsfeed(newsfeedid)
    }
>>>>>>> dev
}
