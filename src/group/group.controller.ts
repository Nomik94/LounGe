import { Body, Get, Post, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import {
  Delete,
  Param,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { CreateGroupDto } from './dto/create.group.dto';
import { ModifyGroupDto } from './dto/modify.group.dto';
import { GroupService } from './group.service';

@Controller('/api/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'groupImage', maxCount: 1 },
      { name: 'backgroundImage', maxCount: 1 },
    ]),
  )
  createGroup(
    @GetUser() user,
    @UploadedFiles() file,
    @Body() data: CreateGroupDto,
  ): void {
    const userId: number = user.id;
    this.groupService.createGroup(file, data, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllGroup(@GetUser() user) {
    const userId: number = user.id;
    return await this.groupService.getAllGroup(userId);
  }

  @Put('/:groupId')
  @UseGuards(JwtAuthGuard)
  async modifyGruop(
    @GetUser() user,
    @Body() data: ModifyGroupDto,
    @Param('groupId') groupId: number,
  ) {
    const userId: number = user.id;
    await this.groupService.modifyGruop(data, userId, groupId);
  }

  @Delete('/:groupId')
  @UseGuards(JwtAuthGuard)
  async deletedGroup(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    await this.groupService.deletedGroup(userId, groupId);
  }

  @Post('/join/:groupId')
  @UseGuards(JwtAuthGuard)
  async sendGroupJoin(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    await this.groupService.sendGroupJoin(userId, groupId);
  }

  @Put('/members/:groupId/:memberId')
  @UseGuards(JwtAuthGuard)
  async acceptGroupJoin(@GetUser() user, @Param() ids) {
    const userId: number = user.id;
    await this.groupService.acceptGroupJoin(userId, ids);
  }

  @Get('/search/:tag')
  @UseGuards(JwtAuthGuard)
  async findGroupsByTag(@GetUser() user, @Param('tag') tag: string) {
    console.log(tag)
    return await this.groupService.findGroupsByTag(tag);
  }

  @Delete('/withdraw/:groupId')
  @UseGuards(JwtAuthGuard)
  async withdrawalGroup(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    await this.groupService.withdrawalGroup(userId, groupId);
  }
}
