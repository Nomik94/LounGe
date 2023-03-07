import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseGuards, UseInterceptors, } from '@nestjs/common';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { newsfeedCheckDto } from './dto/newsfeed-check.dto';
import { modiNewsfeedCheckDto } from './dto/modinewsfeed-check.dto';
import { NewsfeedService } from './newsfeed.service';
import { serchtagnewsfeedCheckDto } from './dto/serchtagnewsfeed.dto';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { group } from 'console';

@Controller('api/newsfeed')
export class NewsfeedController {
  constructor(private readonly newsfeedService: NewsfeedService) {}

  // 뉴스피드 작성
  @Post('newsfeed')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('newsfeedImage', 5)) 

  async postnewsfeed(
    @GetUser() user,
    @UploadedFiles() file: Array<Express.Multer.File>,
    @Body() data: newsfeedCheckDto
    ): Promise<void> {
      const userId = user.id
    await this.newsfeedService.postnewsfeed(file,data,userId);
  }

  // 뉴스피드 읽기
  @Get('newsfeed/:id')
  async readnewsfeed(@Param('id') userId: number) {
    return await this.newsfeedService.readnewsfeed(userId);
  }

  // 뉴스피드 삭제
  @Delete('newsfeed/:newsfeedid')
  @UseGuards(JwtAuthGuard)
  async deletenewsfeed(
      @GetUser() user,
      @Param('newsfeedid')newsfeedid:number
  ) {
      const userId = user.id
      return await this.newsfeedService.deletenewsfeed(userId,newsfeedid)
  }

  // 뉴스피드 수정
  @Put('newsfeed/:newsfeedid')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('newsfeedImage', 5)) 
  async modinewsfeed(
      @GetUser() user,
      @UploadedFiles() file: Array<Express.Multer.File>,
      @Param('newsfeedid') newsfeedid:number,
      @Body() data: modiNewsfeedCheckDto
  ): Promise<void> {
      const userId = user.id
      await this.newsfeedService.modinewsfeed(file,newsfeedid,data,userId)
  }

  // 태그로 뉴스피드 검색
  @Get('/tag/newsfeed')
  async serchtagnewsfeed(
    @Body() data:serchtagnewsfeedCheckDto
  ){
    return await this.newsfeedService.serchtagnewsfeed(data)
  }

  // // 뉴스피드 그룹별 읽기
  // @Get('group/:id')
  // async readnewsfeedgroup(@Param('id') groupId:number) {
  //   return await this.deletenewsfeed.readnewsfeedgroup(groupId)
  // }
}
function UploadFiles() {
  throw new Error('Function not implemented.');
}

