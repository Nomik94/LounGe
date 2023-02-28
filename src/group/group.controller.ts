import { Controller } from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('/api/groups')
export class GroupController {
  constructor(private readonly groupService : GroupService){}
}
