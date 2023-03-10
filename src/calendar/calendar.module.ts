import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEvent } from "../database/entities/userEvent.entity";
import { GroupEvent } from "../database/entities/groupEvent.entity";
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEvent, GroupEvent])],
  controllers: [CalendarController],
  providers: [CalendarService]
})
export class CalendarModule {}
