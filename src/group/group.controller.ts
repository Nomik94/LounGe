import { Body, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateGroupDto } from './dto/create.group.dto';
import { GroupService } from './group.service';

@Controller('/api/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(AuthGuard('access'))
  createGroup(@Req() req, @Body() data: CreateGroupDto): void {
    const userId : number = req.user.id
    this.groupService.createGroup(data, userId);
  }

  @Get()
  @UseGuards(AuthGuard('access'))
  async getAllGroup(@Req() req) {
    const userId : number = req.user.id;
    return await this.groupService.getAllGroup(userId);
  }
}
