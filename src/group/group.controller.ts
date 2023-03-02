import { Body, Get, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateGroupDto } from './dto/create.group.dto';
import { GroupService } from './group.service';

@Controller('/api/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  createGroup(@Body() data: CreateGroupDto): void {
    this.groupService.createGroup(data);
  }

  @Get()
  async getAllGroup() {
    return await this.groupService.getAllGroup()
  }
}
