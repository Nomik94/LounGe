import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { newsfeedCheckDto } from './dto/newsfeed.check.dto';
import { modifyNewsfeedCheckDto } from './dto/modifynewsfeed.check.dto';
import { NewsfeedService } from './newsfeed.service';
import {FilesInterceptor,} from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { GetUser } from 'src/common/decorator/get.user.decorator';

@Controller('api/newsfeed')
export class NewsfeedController {
  constructor(private readonly newsfeedService: NewsfeedService) {}

  // 뉴스피드 작성 API
  @Post('/newsfeed/:groupId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('newsfeedImage', 5))
  async createNewsfeed(
    @Param('groupId') groupId: number,
    @GetUser() user,
    @UploadedFiles() file: Array<Express.Multer.File>,
    @Body() data: newsfeedCheckDto,
  ): Promise<void> {
    const userId = user.id;
    return await this.newsfeedService.createNewsfeed(file, data, userId, groupId);
  }

  // 뉴스피드 삭제 API
  @Delete('newsfeed/:newsfeedId')
  @UseGuards(JwtAuthGuard)
  async deleteNewsfeed(
    @GetUser() user,
    @Param('newsfeedId') newsfeedId: number,
  ):Promise<void> {
    const userId = user.id;
    return await this.newsfeedService.deleteNewsfeed(userId, newsfeedId);
  }

  // 뉴스피드 수정 API
  @Put('newsfeed/:newsfeedId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('newsfeedImage', 5))
  async modifyNewsfeed(
    @GetUser() user,
    @UploadedFiles() file: Array<Express.Multer.File>,
    @Param('newsfeedId') newsfeedId: number,
    @Body() data: modifyNewsfeedCheckDto,
  ): Promise<void> {
    const userId = user.id;
    await this.newsfeedService.modifyNewsfeed(file, newsfeedId, data, userId);
  }

  // 태그 검색 (소속 그룹 뉴스피드) API
  @Get('tag/newsfeed')
  async serchTagNewsfeed(@Query() data):Promise<Array<any>> {
    const { tag } = data;
    return await this.newsfeedService.serchTagNewsfeed(tag);
  }

  // 태그 검색 (특정 그룹) API
  @Get('tag/:groupId')
  async serchTagNewsfeedGroup(
    @Query() data,
    @Param('groupId') groupId: number,
  ):Promise<Array<any>> {
    return await this.newsfeedService.serchTagNewsfeedGroup(data, groupId);
  }

  // 태그 검색 (내 뉴스피드) API
  @Get('tag/newsfeed/list')
  @UseGuards(JwtAuthGuard)
  async serchTagMyNewsfeed(@Query('tag') data: string, @GetUser() user):Promise<Array<any>> {
    const userId = user.id;
    return await this.newsfeedService.serchTagMyNewsfeed(data, userId);
  }

  // 뉴스피드 읽기 (특정 그룹) API
  @Get('group/:id')
  async readNewsfeedGroup(@Param('id') groupId: number):Promise<Array<any>> {
    return await this.newsfeedService.readNewsfeedGroup(groupId);
  }

  // 뉴스피드 읽기 (내 뉴스피드) API
  @Get('newsfeed')
  @UseGuards(JwtAuthGuard)
  async readNewsfeedMyList(@GetUser() user):Promise<Array<any>> {
    const userId = user.id;
    return await this.newsfeedService.readNewsfeedMyList(userId);
  }

  // 뉴스피드 읽기 (소속 그룹 뉴스피드) API
  @Get('newsfeed/groups')
  @UseGuards(JwtAuthGuard)
  async readNewsfeedMyGroup(@GetUser() user):Promise<Array<any>> {
    const userId = user.id;
    return await this.newsfeedService.readNewsfeedMyGroup(userId);
  }
}