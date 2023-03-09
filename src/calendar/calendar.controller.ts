import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateGroupEventDto } from './dto/create-groupEvent.dto';
import { UserEventDto } from './dto/userEvent.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UpdateUserEventDto } from './dto/updateUserEvent.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}
  // userEvents
  @Get('/uevents')
  // @UseGuards(JwtAuthGuard)
  async getUserEvent(@GetUser() user) {
    const userId: number = user.id;
    return await this.calendarService.getUserEvent()
  }

  //이벤트 상세보기
  @Get('/uevents/:id')
  // @UseGuards(JwtAuthGuard)
  async getUserEventById(@Param('id') eventId: number) {
    return await this.calendarService.getUserEventById(eventId);
  }

  @Post('/uevents')
  async createUserEvent(@Body() data: UserEventDto) {
    const userId = 2
    return await this.calendarService.createUserEvent(userId, data);
  }

  @Put('/uevents/:id')
  updateUserEvent(
    @Param('id') eventId: number,
    @Body() data: UpdateUserEventDto
  ) {
    const userId = 1
    return this.calendarService.updateUserEvent(userId,eventId,data);
  }

  @Delete('/uevents/:id')
  deleteUserEvent(
    @Param('id') eventId: number,
    @Body() data,
  ) {
    return this.calendarService.deleteUserEvent(eventId, data.userId);
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
    @Body() data
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
    @Body() data
  ) {
    return this.calendarService.deleteGroupEvent(eventId, data.groupId);
  }
}