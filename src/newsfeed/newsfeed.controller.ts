import { Body, Controller, Post } from '@nestjs/common';
import { newsfeedCheckDto } from './dto/newsfeed-check.dto';
import { NewsfeedService } from './newsfeed.service';

// @Controller('api/newsfeed')
// export class NewsfeedController {
//     constructor(private readonly newsfeedService:NewsfeedService) {}

//     // 뉴스피드 작성
//     @Post('newsfeed')
//     async postnewsfeed(@Body() data: newsfeedCheckDto): Promise<void>{
//         return await this.newsfeedService.postnewsfeed(data)
//     }
// }


@Controller('newsfeed')
export class NewsfeedController {
    constructor(private readonly service:NewsfeedService){}
    @Post('newsfeed')
    async postnewsfeed(@Body() content:string,userId:number,tag:string,image:string){
        return await this.service.postnewsfeed("테스트코드",1,"여름","이미지링크")
    }
}