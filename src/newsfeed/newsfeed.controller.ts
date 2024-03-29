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
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { GetUser } from 'src/common/decorator/get.user.decorator';
import { ISerchTagNewsfeed } from './interface/serch.tag.newsfeed.interface';
import { ISerchTagMyNewsfeed } from './interface/serch.tag.mynewsfeed.interface';
import { ISerchNewsfeedList } from './interface/serch.newsfeed.list.interface';
import { IFirstNesfeed } from './interface/firstNewsfeed.interface';

@Controller('api/newsfeed')
export class NewsfeedController {
  constructor(
    private readonly newsfeedService: NewsfeedService,
    ) {}

  // 뉴스피드 작성 API
  @Post('/newsfeed/:groupId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('newsfeedImage', 5))
  async createNewsfeed(
    @Param('groupId') groupId: number,
    @GetUser() user: IUser,
    @UploadedFiles() file: Express.MulterS3.File,
    @Body() data: newsfeedCheckDto,
  ): Promise<void> {
    const userId = user.id;
    return await this.newsfeedService.createNewsfeed(
      file,
      data,
      userId,
      groupId,
    );
  }

  // 뉴스피드 삭제 API
  @Delete('newsfeed/:newsfeedId')
  @UseGuards(JwtAuthGuard)
  async deleteNewsfeed(
    @GetUser() user: IUser,
    @Param('newsfeedId') newsfeedId: number,
  ): Promise<void> {
    const userId = user.id;
    return await this.newsfeedService.deleteNewsfeed(userId, newsfeedId);
  }

  // 뉴스피드 수정 API
  @Put('newsfeed/:newsfeedId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('newsfeedImage', 5))
  async modifyNewsfeed(
    @GetUser() user: IUser,
    @UploadedFiles() file: Express.MulterS3.File,
    @Param('newsfeedId') newsfeedId: number,
    @Body() data: modifyNewsfeedCheckDto,
  ): Promise<void> {
    const userId = user.id;
    await this.newsfeedService.modifyNewsfeed(file, newsfeedId, data, userId);
  }

  // 태그 검색 (소속 그룹 뉴스피드) API
  @Get('tag/newsfeed')
  @UseGuards(JwtAuthGuard)
  async serchTagNewsfeed(
    @Query('tag') data: string,
    @GetUser() user: IUser,
  ): Promise<ISerchTagNewsfeed[]> {
    const userId = user.id;
    const NewsfeedIds = await this.newsfeedService.elasticTagIndex(data)
    return await this.newsfeedService.serchTagNewsfeed(userId,NewsfeedIds);
  }

  // 태그 검색 (특정 그룹) API
  @Get('tag/:groupId')
  @UseGuards(JwtAuthGuard)
  async serchTagNewsfeedGroup(
    @Query('tag') data: string,
    @Param('groupId') groupId: number,
    @GetUser() user: IUser,
  ): Promise<ISerchTagNewsfeed[]> {
    const userId = user.id;
    const NewsfeedIds = await this.newsfeedService.elasticTagIndex(data)
    return await this.newsfeedService.serchTagNewsfeedGroup(groupId, userId,NewsfeedIds);
  }

  // 태그 검색 (내 뉴스피드) API
  @Get('tag/newsfeed/list')
  @UseGuards(JwtAuthGuard)
  async serchTagMyNewsfeed(
    @Query('tag') data: string,
    @GetUser() user: IUser,
  ): Promise<ISerchTagMyNewsfeed[]> {
    const userId = user.id;
    const NewsfeedIds = await this.newsfeedService.elasticTagIndex(data)
    return await this.newsfeedService.serchTagMyNewsfeed(userId,NewsfeedIds);
  }

  // 뉴스피드 읽기 (특정 그룹) API
  @Get('group/:id/:page')
  @UseGuards(JwtAuthGuard)
  async readNewsfeedGroup(
    @GetUser() user: IUser,
    @Param('id') groupId: number,
    @Param('page') page: number,
  ): Promise<ISerchNewsfeedList[] | IFirstNesfeed> {
    const userId = user.id;
    return await this.newsfeedService.readNewsfeedGroup(groupId, page, userId);
  }

  // 뉴스피드 읽기 (내 뉴스피드) API
  @Get('newsfeed/:page')
  @UseGuards(JwtAuthGuard)
  async readNewsfeedMyList(
    @GetUser() user: IUser,
    @Param('page') page: number,
  ): Promise<ISerchNewsfeedList[] | IFirstNesfeed> {
    const userId = user.id;
    return await this.newsfeedService.readNewsfeedMyList(userId, page);
  }

  // 뉴스피드 읽기 (소속 그룹 뉴스피드) API
  @Get('newsfeed/groups/:page')
  @UseGuards(JwtAuthGuard)
  async readNewsfeedMyGroup(
    @GetUser() user: IUser,
    @Param('page') page: number,
  ): Promise<ISerchNewsfeedList[] | IFirstNesfeed> {
    const userId = user.id;
    return await this.newsfeedService.readNewsfeedMyGroup(userId, page);
  }

  // 헤더에서 뉴스피드 내용 검색
  @Get('serchbar/tag')
  @UseGuards(JwtAuthGuard)
  async serchBarTagNewsfeed(
    @Query('tag') data: string,
    @GetUser() user: IUser,
  ): Promise<ISerchNewsfeedList[]> {
    const userId = user.id;
    const NewsfeedIds = await this.newsfeedService.testSearchIndex(data)
    return await this.newsfeedService.serchBarTagNewsfeed(userId, NewsfeedIds);
  }

  // 수정 시 컨텐츠 내용 가져오기
  @Get('content/:id')
  @UseGuards(JwtAuthGuard)
  async getNewsfeedContent(
    @GetUser() user: IUser,
    @Param('id') id: number,
  ) {
    return await this.newsfeedService.getNewsfeedContent(id)
  }
}
