import { Body, Get, Post, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Delete, Param, Put } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { CreateGroupDto } from './dto/create.group.dto';
import { FindGroupTagDto } from './dto/find.group.tag.dto';
import { ModifyGroupDto } from './dto/modify.group.dto';
import { GroupService } from './group.service';

@Controller('/api/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createGroup(@GetUser() user, @Body() data: CreateGroupDto): void {
    const userId: number = user.id;
    this.groupService.createGroup(data, userId);
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

  @Get('/search/tag')
  @UseGuards(JwtAuthGuard)
  async findGroupsByTag(@GetUser() user, @Body('tag') tag: FindGroupTagDto) {
    return await this.groupService.findGroupsByTag(tag);
  }
}
