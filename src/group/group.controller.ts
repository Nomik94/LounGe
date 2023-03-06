import { Body, Get, Post, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Delete, Param, Put } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { CreateGroupDto } from './dto/create.group.dto';
import { ModifyGroupDto } from './dto/modify.group.dto';
import { GroupService } from './group.service';

@Controller('/api/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createGroup(@GetUser() user, @Body() data: CreateGroupDto): void {
    const userId: number = user.id;
    this.groupService.createGroup(data, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllGroup(@GetUser() user) {
    const userId: number = user.id;
    return await this.groupService.getAllGroup(userId);
  }

  @Put('/:groupId')
  @UseGuards(AuthGuard('jwt'))
  async modifyGruop(
    @GetUser() user,
    @Body() data: ModifyGroupDto,
    @Param('groupId') groupId: number,
  ) {
    const userId: number = user.id;
    await this.groupService.modifyGruop(data, userId, groupId);
  }

  @Delete('/:groupId')
  @UseGuards(AuthGuard('jwt'))
  async deletedGroup(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    await this.groupService.deletedGroup(userId, groupId);
  }

  @Post('/join/:groupId')
  @UseGuards(AuthGuard('jwt'))
  async sendGroupJoin(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    await this.groupService.sendGroupJoin(userId, groupId);
  }

  @Put('/members/:groupId/:memberId')
  @UseGuards(AuthGuard('jwt'))
  async acceptGroupJoin(@GetUser() user, @Param() data) {
    const userId: number = user.id;
    await this.groupService.acceptGroupJoin(userId, data);
  }
}
