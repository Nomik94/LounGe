import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { CreateGroupDto } from './dto/create.group.dto';
import { GroupService } from './group.service';

@Controller('/api/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  createGroup(@Body() data: CreateGroupDto): void {
    this.groupService.createGroup(data);
  }
}
