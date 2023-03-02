import { Body, Controller, Post } from '@nestjs/common';
import { newsfeedCheckDto } from './dto/newsfeed-check.dto';
import { NewsfeedService } from './newsfeed.service';

@Controller('api/newsfeed')
export class NewsfeedController {
    constructor(private readonly newsfeedService:NewsfeedService) {}

    // 뉴스피드 작성
    @Post('newsfeed')
    async postnewsfeed(@Body() data: newsfeedCheckDto): Promise<void>{
        return await this.newsfeedService.postnewsfeed(data)
    }
}
