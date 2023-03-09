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
import { GroupTransfer } from './interface/group.transfer.interface';

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
  async getAllGroup(@GetUser() user) {
    const userId: number = user.id;
    return await this.groupService.getAllGroup(userId);
  }

  // 그룹 수정 API
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

  // 그룹 삭제 API
  @Delete('/:groupId')
  @UseGuards(JwtAuthGuard)
  async deletedGroup(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    await this.groupService.deletedGroup(userId, groupId);
  }

  // 그룹 가입 API
  @Post('/:groupId/join')
  @UseGuards(JwtAuthGuard)
  async sendGroupJoin(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    await this.groupService.sendGroupJoin(userId, groupId);
  }

  // 그룹 가입 신청 수락 API
  @Put('/:groupId/members/:memberId')
  @UseGuards(JwtAuthGuard)
  async acceptGroupJoin(@GetUser() user, @Param() ids) {
    const userId: number = user.id;
    await this.groupService.acceptGroupJoin(userId, ids);
  }

  // 그룹 태그 검색 API
  @Get('/search/:tag')
  @UseGuards(JwtAuthGuard)
  async findGroupsByTag(@GetUser() user, @Param('tag') tag: string) {
    console.log(tag);
    return await this.groupService.findGroupsByTag(tag);
  }

  // 그룹 탈퇴 API
  @Delete('/:groupId/withdraw')
  @UseGuards(JwtAuthGuard)
  async withdrawalGroup(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    await this.groupService.withdrawalGroup(userId, groupId);
  }

  // 매니지먼트 그룹 리스트 API
  @Get('/created/list')
  @UseGuards(JwtAuthGuard)
  async createdGroupList(@GetUser() user) {
    const userId: number = user.id;
    return await this.groupService.createdGroupList(userId);
  }

  // 소속된 그룹 리스트 API
  @Get('/joined/list')
  @UseGuards(JwtAuthGuard)
  async joinedGroupList(@GetUser() user) {
    const userId: number = user.id;
    return await this.groupService.joinedGroupList(userId);
  }

  // 그룹 가입 신청자 API
  @Get('/:groupId/applicant/list/')
  @UseGuards(JwtAuthGuard)
  async groupApplicantList(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    return await this.groupService.groupApplicantList(userId, groupId);
  }

  // 그룹 멤버 리스트 API
  @Get(':groupId/members/list/')
  @UseGuards(JwtAuthGuard)
  async groupMembers(@Param('groupId') groupId: number) {
    return await this.groupService.groupMembers(groupId);
  }

  // 그룹 양도 API
  @Put('/:groupId/leaders/transfer/:memberId')
  @UseGuards(JwtAuthGuard)
  async groupTransfer(@GetUser() user, @Param() ids: GroupTransfer) {
    const userId: number = user.id;
    return await this.groupService.groupTransfer(userId, ids);
  }

  // 그룹 추방 API
  @Delete('/:groupId/kickout/:memberId')
  @UseGuards(JwtAuthGuard)
  async kickOutGroup(@GetUser() user, @Param() ids: GroupTransfer) {
    const userId: number = user.id;
    return await this.groupService.kickOutGroup(userId, ids);
  }
}
