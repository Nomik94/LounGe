import { Body,Controller,Delete,Get,Param,Post,Put } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/create-event.dto';
import { DeleteEventDto } from './dto/delete-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';


@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('/events')
  getEvent() {
    return this.calendarService.getEvent();
  }

  @Get('/events/:id')
  getEventById(@Param('id') eventId: number) {
    return this.calendarService.getEventById(eventId);
  }

  @Post('/events')
  createEvent(@Body() data: CreateEventDto) {
    return this.calendarService.createEvent(
      data.eventName,
      data.eventContent,
      data.start,
      data.end,
      data.groupId,
      data.createdAt,
      data.deletedAt
    );
  }

  @Put('/events/:id')
  updateEvent(
    @Param('id') eventId: number,
    @Body() data: UpdateEventDto,
  ) {
    return this.calendarService.updateEvent(
      eventId,
      data.eventName,
      data.eventContent,
      data.start,
      data.end,
      data.groupId,
      data.createdAt,
      data.deletedAt,
      );
  }

  @Delete('/events/:id')
  deleteEvent(
    @Param('id') eventId: number,
    @Body() data: DeleteEventDto,
  ) {
    return this.calendarService.deleteEvent(eventId,data.groupId);
  }
}