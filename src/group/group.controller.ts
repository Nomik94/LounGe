import { Body, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Delete, Param, Put } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { AcceptGroupJoinDto } from './dto/accept.group.join.dto';
import { CreateGroupDto } from './dto/create.group.dto';
import { ModifyGroupDto } from './dto/modify.group.dto';
import { GroupService } from './group.service';

@Controller('/api/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createGroup(@Req() req, @Body() data: CreateGroupDto): void {
    const userId: number = req.user.id;
    this.groupService.createGroup(data, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllGroup(@Req() req) {
    const userId: number = req.user.id;
    return await this.groupService.getAllGroup(userId);
  }

  @Put('/:groupId')
  @UseGuards(AuthGuard('jwt'))
  async modifyGruop(
    @Req() req,
    @Body() data: ModifyGroupDto,
    @Param('groupId') groupId: number,
  ) {
    const userId: number = req.user.id;
    await this.groupService.modifyGruop(data, userId, groupId);
  }

  @Delete('/:groupId')
  @UseGuards(AuthGuard('jwt'))
  async deletedGroup(@Req() req, @Param('groupId') groupId: number) {
    const userId: number = req.user.id;
    await this.groupService.deletedGroup(userId, groupId);
  }

  @Post('/join/:groupId')
  @UseGuards(AuthGuard('jwt'))
  async sendGroupJoin(@Req() req, @Param('groupId') groupId: number) {
    const userId: number = req.user.id;
    await this.groupService.sendGroupJoin(userId, groupId);
  }

  @Put('/members/:groupId/:memberId')
  @UseGuards(AuthGuard('jwt'))
  async acceptGroupJoin(@Req() req, @Param() data) {
    const userId: number = req.user.id;
    await this.groupService.acceptGroupJoin(userId, data);
  }
}
