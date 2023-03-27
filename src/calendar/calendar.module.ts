import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEvent } from '../database/entities/userEvent.entity';
import { GroupEvent } from '../database/entities/groupEvent.entity';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { Group } from 'src/database/entities/group.entity';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { UserGroupRepository } from 'src/common/repository/user.group.repository';
import { UserEventRepository } from 'src/common/repository/userEvent.repository';
import { GroupEventRepository } from 'src/common/repository/groupEvent.repository';
import { GroupRepository } from 'src/common/repository/group.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEvent, GroupEvent, Group, UserGroup]),
  ],
  controllers: [CalendarController],
  providers: [
    CalendarService,
    UserGroupRepository,
    UserEventRepository,
    GroupEventRepository,
    GroupRepository,
  ],
})
export class CalendarModule {}
