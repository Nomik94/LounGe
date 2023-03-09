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
  @Post('newsfeed/:groupId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('newsfeedImage', 5)) 

  async postnewsfeed(
    @Param('groupId')groupId:number ,
    @GetUser() user,
    @UploadedFiles() file: Array<Express.Multer.File>,
    @Body() data: newsfeedCheckDto
    ): Promise<void> {
      const userId = user.id
 
    await this.newsfeedService.postnewsfeed(file,data,userId,groupId);
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

  // 뉴스피드 그룹별 읽기
  @Get('group/:id')
  async readnewsfeedgroup(
    @Param('id') groupId: number
    ) {
    return await this.newsfeedService.readnewsfeedgroup(groupId)
  }

  // 뉴스피드 읽기
  @Get('newsfeed')
  @UseGuards(JwtAuthGuard)
  async readnewsfeedmy(
    @GetUser() user,
    ) {
      const userId = user.id
      console.log("유저아이디",userId);
      
    return await this.newsfeedService.readnewsfeedmy(userId);
  }

  // 뉴스피드 읽기 (내가 소속된 모든 그룹의 뉴스피드)
  @Get('newsfeed/mygroup')
  @UseGuards(JwtAuthGuard)
  async readnewsfeedmygroup(
    @GetUser() user,
  ){
    const userId = user.id
    return await this.newsfeedService.readnewsfeedmygroup(userId)
  }
}
function UploadFiles() {
  throw new Error('Function not implemented.');
}
