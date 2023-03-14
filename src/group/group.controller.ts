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
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { GetUser } from 'src/common/decorator/get.user.decorator';
import { CreateGroupDto } from './dto/create.group.dto';
import { ModifyGroupDto } from './dto/modify.group.dto';
import { GroupService } from './group.service';
import { GroupTransfer } from './interface/transfer.group.interface';

@Controller('/api/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

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
    @GetUser() user,
    @UploadedFiles() file,
    @Body() data: CreateGroupDto,
  ): Promise<void> {
    const userId: number = user.id;
    await this.groupService.createGroup(file, data, userId);
  }

  // 그룹 리스트 API
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllGroupList(@GetUser() user) {
    const userId: number = user.id;
    return await this.groupService.getAllGroupList(userId);
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
    @GetUser() user,
    @Body() data: ModifyGroupDto,
    @UploadedFiles() file,
    @Param('groupId') groupId: number,
  ) {
    const userId: number = user.id;
    await this.groupService.modifyGroup(data, file, userId, groupId);
  }

  // 그룹 삭제 API
  @Delete('/:groupId')
  @UseGuards(JwtAuthGuard)
  async deleteGroup(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    await this.groupService.deleteGroup(userId, groupId);
  }

  // 그룹 가입 API
  @Post('/:groupId/join')
  @UseGuards(JwtAuthGuard)
  async addGroupJoinRequest(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    await this.groupService.addGroupJoinRequest(userId, groupId);
  }

  // 그룹 가입 신청 수락 API
  @Put('/:groupId/members/:memberId')
  @UseGuards(JwtAuthGuard)
  async acceptGroupJoinRequest(@GetUser() user, @Param() ids) {
    const userId: number = user.id;
    await this.groupService.acceptGroupJoinRequest(userId, ids);
  }

  // 그룹 태그 검색 API
  @Get('/search/:tag')
  @UseGuards(JwtAuthGuard)
  async searchGroupByTag(@GetUser() user, @Param('tag') tag: string) {
    console.log(tag);
    return await this.groupService.searchGroupByTag(tag);
  }

  // 그룹 탈퇴 API
  @Delete('/:groupId/withdraw')
  @UseGuards(JwtAuthGuard)
  async leaveGroup(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    await this.groupService.leaveGroup(userId, groupId);
  }

  // 매니지먼트 그룹 리스트 API
  @Get('/created/list')
  @UseGuards(JwtAuthGuard)
  async getGroupManagementList(@GetUser() user) {
    const userId: number = user.id;
    return await this.groupService.getGroupManagementList(userId);
  }

  // 소속된 그룹 리스트 API
  @Get('/joined/list')
  @UseGuards(JwtAuthGuard)
  async getMyGroupList(@GetUser() user) {
    const userId: number = user.id;
    return await this.groupService.getMyGroupList(userId);
  }

  // 그룹 가입 신청자 API
  @Get('/:groupId/applicant/list/')
  @UseGuards(JwtAuthGuard)
  async getGroupJoinRequestList(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    return await this.groupService.getGroupJoinRequestList(userId, groupId);
  }

  // 그룹 멤버 리스트 API
  @Get(':groupId/members/list/')
  @UseGuards(JwtAuthGuard)
  async getGroupMemberList(@Param('groupId') groupId: number) {
    return await this.groupService.getGroupMemberList(groupId);
  }

  // 그룹 양도 API
  @Put('/:groupId/leaders/transfer/:memberId')
  @UseGuards(JwtAuthGuard)
  async transferGroupOwnership(@GetUser() user, @Param() ids: GroupTransfer) {
    const userId: number = user.id;
    return await this.groupService.transferGroupOwnership(userId, ids);
  }

  // 그룹 추방 API
  @Delete('/:groupId/kickout/:memberId')
  @UseGuards(JwtAuthGuard)
  async removeGroupMember(@GetUser() user, @Param() ids: GroupTransfer) {
    const userId: number = user.id;
    return await this.groupService.removeGroupMember(userId, ids);
  }

  @Delete('/:groupId/reject/:memberId')
  @UseGuards(JwtAuthGuard)
  async rejectGroupJoinRequest(@GetUser() user, @Param() ids: GroupTransfer) {
    const userId: number = user.id;
    return await this.groupService.rejectGroupJoinRequest(userId, ids);
  }
}
