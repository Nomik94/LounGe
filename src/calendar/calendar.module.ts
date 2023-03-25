import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEvent } from '../database/entities/userEvent.entity';
import { GroupEvent } from '../database/entities/groupEvent.entity';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { Group } from 'src/database/entities/group.entity';
import { UserGroupRepository } from 'src/common/repository/user.group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEvent, GroupEvent, Group])],
  controllers: [CalendarController],
  providers: [CalendarService, UserGroupRepository],
})
export class CalendarModule {}
