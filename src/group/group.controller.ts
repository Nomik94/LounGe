import { Body, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import {
  Delete,
  Param,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { GetUser } from 'src/common/decorator/get.user.decorator';
import { Group } from 'src/database/entities/group.entity';
import { CreateGroupDto } from './dto/create.group.dto';
import { ModifyGroupDto } from './dto/modify.group.dto';
import { GroupService } from './group.service';
import { IFile } from './interface/file.interface';
import { IMyGroupList } from './interface/get.my.group.list.interface';
import { IJoinRequest } from './interface/group.join.request.interface';
import { IMemberList } from './interface/group.member.list.interface';
import { IMapGroups } from './interface/map.group.tag.interface';
import { IGroupWithMemberIdsStr } from './interface/member.group.ids.interface';

@Controller('/api/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  // 미가입 그룹 리스트 API
  @Get('/:page')
  @UseGuards(JwtAuthGuard)
  async getAllGroupList(
    @Param('page') page: number,
    @GetUser() user: IUser,
  ): Promise<IMapGroups[]> {
    const userId: number = user.id;
    return await this.groupService.getAllGroupList(userId, page);
  }

  // 가입 신청 그룹 리스트 API
  @Get('/joined/requests/:page')
  @UseGuards(JwtAuthGuard)
  async getGroupJoinList(
    @Param('page') page: number,
    @GetUser() user: IUser,
  ): Promise<IMapGroups[]> {
    const userId: number = user.id;
    return await this.groupService.getGroupJoinList(userId, page);
  }

  // 그룹 태그 검색 리스트 API
  @Get('/search/tag')
  @UseGuards(JwtAuthGuard)
  async searchGroupByTag(
    @GetUser() user: IUser,
    @Query('tag') tag: string,
    @Query('page') page: number,
  ): Promise<IMapGroups[]> {
    console.log(tag,page ,'1111')
    return await this.groupService.searchGroupByTag(tag, page);
  }

  // 소속된 그룹 리스트 API
  @Get('/joined/list/:page')
  @UseGuards(JwtAuthGuard)
  async getMyGroupList(
    @GetUser() user: IUser,
    @Param('page') page: number,
  ): Promise<IMyGroupList[]> {
    const userId: number = user.id;
    return await this.groupService.getMyGroupList(userId, page);
  }

  // 그룹 관리 리스트 API
  @Get('/created/list/:page')
  @UseGuards(JwtAuthGuard)
  async getGroupManagementList(
    @GetUser() user: IUser,
    @Param('page') page: number,
  ): Promise<Group[]> {
    const userId: number = user.id;
    return await this.groupService.getGroupManagementList(userId, page);
  }

  // 그룹 멤버 리스트 API
  @Get(':groupId/members/list/')
  @UseGuards(JwtAuthGuard)
  async getGroupMemberList(
    @Param('groupId') groupId: number,
  ): Promise<IMemberList> {
    return await this.groupService.getGroupMemberList(groupId);
  }

  // 그룹 가입 신청자 리스트 API
  @Get('/:groupId/applicant/list/')
  @UseGuards(JwtAuthGuard)
  async getGroupJoinRequestList(
    @GetUser() user: IUser,
    @Param('groupId') groupId: number,
  ): Promise<IJoinRequest[]> {
    const userId: number = user.id;
    return await this.groupService.getGroupJoinRequestList(userId, groupId);
  }

  // 그룹 생성 API
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'groupImage', maxCount: 1 },
      { name: 'backgroundImage', maxCount: 1 },
    ]),
  )
  async createGroup(
    @GetUser() user: IUser,
    @UploadedFiles() file: IFile,
    @Body() data: CreateGroupDto,
  ): Promise<void> {
    const userId: number = user.id;
    await this.groupService.createGroup(file, data, userId);
  }

  // 그룹 수정 API
  @Put('/:groupId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'groupImage', maxCount: 1 },
      { name: 'backgroundImage', maxCount: 1 },
    ]),
  )
  async modifyGroup(
    @GetUser() user: IUser,
    @Body() data: ModifyGroupDto,
    @UploadedFiles() file: IFile,
    @Param('groupId') groupId: number,
  ): Promise<void> {
    const userId: number = user.id;
    await this.groupService.modifyGroup(data, file, userId, groupId);
  }

  // 그룹 삭제 API
  @Delete('/:groupId')
  @UseGuards(JwtAuthGuard)
  async deleteGroup(
    @GetUser() user: IUser,
    @Param('groupId') groupId: number,
  ): Promise<void> {
    const userId: number = user.id;
    await this.groupService.deleteGroup(userId, groupId);
  }

  // 그룹 양도 API
  @Put('/:groupId/leaders/transfer/:memberId')
  @UseGuards(JwtAuthGuard)
  async transferGroupOwnership(
    @GetUser() user: IUser,
    @Param() ids: IGroupWithMemberIdsStr,
  ): Promise<void> {
    const userId: number = user.id;
    return await this.groupService.transferGroupOwnership(userId, ids);
  }

  // 그룹 추방 API
  @Delete('/:groupId/kickout/:memberId')
  @UseGuards(JwtAuthGuard)
  async removeGroupMember(
    @GetUser() user: IUser,
    @Param() ids: IGroupWithMemberIdsStr,
  ): Promise<void> {
    const userId: number = user.id;
    return await this.groupService.removeGroupMember(userId, ids);
  }

  // 그룹 가입 신청 수락 API
  @Put('/:groupId/members/:memberId')
  @UseGuards(JwtAuthGuard)
  async acceptGroupJoinRequest(
    @GetUser() user: IUser,
    @Param() ids: IGroupWithMemberIdsStr,
  ): Promise<void> {
    const userId: number = user.id;
    await this.groupService.acceptGroupJoinRequest(userId, ids);
  }

  // 그룹 가입 거절 API
  @Delete('/:groupId/reject/:memberId')
  @UseGuards(JwtAuthGuard)
  async rejectGroupJoinRequest(
    @GetUser() user: IUser,
    @Param() ids: IGroupWithMemberIdsStr,
  ): Promise<void> {
    const userId: number = user.id;
    return await this.groupService.rejectGroupJoinRequest(userId, ids);
  }

  // 그룹 가입 신청 API
  @Post('/:groupId/join')
  @UseGuards(JwtAuthGuard)
  async addGroupJoinRequest(
    @GetUser() user: IUser,
    @Param('groupId') groupId: number,
  ): Promise<void> {
    const userId: number = user.id;
    await this.groupService.addGroupJoinRequest(userId, groupId);
  }

  // 그룹 탈퇴 API
  @Delete('/:groupId/withdraw')
  @UseGuards(JwtAuthGuard)
  async leaveGroup(
    @GetUser() user: IUser,
    @Param('groupId') groupId: number,
  ): Promise<void> {
    const userId: number = user.id;
    await this.groupService.leaveGroup(userId, groupId);
  }
}
