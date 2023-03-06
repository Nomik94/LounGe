import { Body,Controller,Delete,Get,Param,Post,Put } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateGroupEventDto } from './dto/create-groupEvent.dto';
import { DeleteGroupEventDto } from './dto/delete-groupEvent.dto';
import { UpdateGroupEventDto } from './dto/update-groupEvent.dto';
import { CreateUserEventDto } from './dto/create-userEvent.dto';
import { DeleteUserEventDto } from './dto/delete-userEvent.dto';
import { UpdateUserEventDto } from './dto/update-userEvent.dto';


@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}
// userEvents 
  @Get('/uevents')
  getUserEvent() {
    return this.calendarService.getUserEvent();
  }

  @Get('/uevents/:id')
  getUserEventById(@Param('id') eventId: number) {
    return this.calendarService.getUserEventById(eventId);
  }

  @Post('/uevents')
  createUserEvent(@Body() data: CreateUserEventDto) {
    return this.calendarService.createUserEvent(
      data.eventName,
      data.eventContent,
      data.start,
      data.end,
      data.userId,
    );
  }

  @Put('/uevents/:id')
  updateUserEvent(
    @Param('id') eventId: number,
    @Body() data: UpdateUserEventDto,
  ) {
    return this.calendarService.updateUserEvent(
      eventId,
      data.eventName,
      data.eventContent,
      data.start,
      data.end,
      data.userId,
      );
  }

  @Delete('/uevents/:id')
  deleteUserEvent(
    @Param('id') eventId: number,
    @Body() data: DeleteUserEventDto,
  ) {
    return this.calendarService.deleteUserEvent(eventId,data.userId);
  }


// groupEvents
  @Get('/gevents')
  getGroupEvent() {
    return this.calendarService.getGroupEvent();
  }

  @Get('/gevents/:id')
  getGroupEventById(@Param('id') eventId: number) {
    return this.calendarService.getGroupEventById(eventId);
  }

  @Post('/gevents')
  createGroupEvent(@Body() data: CreateGroupEventDto) {
    return this.calendarService.createGroupEvent(
      data.eventName,
      data.eventContent,
      data.start,
      data.end,
      data.groupId,
    );
  }

  @Put('/gevents/:id')
  updateGroupEvent(
    @Param('id') eventId: number,
    @Body() data: UpdateGroupEventDto,
  ) {
    return this.calendarService.updateGroupEvent(
      eventId,
      data.eventName,
      data.eventContent,
      data.start,
      data.end,
      data.groupId,
      );
  }

  @Delete('/gevents/:id')
  deleteGroupEvent(
    @Param('id') eventId: number,
    @Body() data: DeleteGroupEventDto,
  ) {
    return this.calendarService.deleteGroupEvent(eventId,data.groupId);
  }
}