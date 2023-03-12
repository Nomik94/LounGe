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
import { GroupEventDto } from './dto/groupEvent.dto';
import { UserEventDto } from './dto/userEvent.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UpdateUserEventDto } from './dto/updateUserEvent.dto';
import { UpdateGroupEventDto } from './dto/updategroupEvent.dto';

@Controller('/api/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}


  @Get('/uevents')
  @UseGuards(JwtAuthGuard)
  async getUserEvent(@GetUser() user) {
    const userId: number = user.id;
    return await this.calendarService.getUserEvent()
  }


  @Get('/uevents/:id')
  @UseGuards(JwtAuthGuard)
  async getUserEventById(@Param('id') eventId: number) {
    return await this.calendarService.getUserEventById(eventId);
  }

  // 유저 이벤트 생성 API
  @Post('/users')
  @UseGuards(JwtAuthGuard)
  async createUserEvent(@GetUser() user,@Body() data: UserEventDto) {
    const userId = user.id
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
  // @UseGuards(JwtAuthGuard)
  async getGroupEvent(@GetUser() user) {
    const GroupId: number = user.id;
    return await this.calendarService.getGroupEvent();
  }
  
  @Get('/gevents/:id')
    // @UseGuards(JwtAuthGuard)
  getGroupEventById(@Param('id') eventId: number) {
    return this.calendarService.getGroupEventById(eventId);
  }

  @Post('/gevents')
  async createGroupEvent(@Body() data: GroupEventDto) {
    const groupId = 1
    return this.calendarService.createGroupEvent(groupId,data
    );
  }

  @Put('/gevents/:id')
  updateGroupEvent(
    @Param('id') eventId: number,
    @Body() data: UpdateGroupEventDto
  ) {
    const groupId = 1
    return this.calendarService.updateGroupEvent(groupId,eventId,data)
  }

  @Delete('/gevents/:id')
  deleteGroupEvent(
    @Param('id') eventId: number,
    @Body() data
  ) {
    return this.calendarService.deleteGroupEvent(eventId, data.groupId);
  }
}