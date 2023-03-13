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

  @Get('/uevents/:id')
  @UseGuards(JwtAuthGuard)
  async getUserEventById(@Param('id') eventId: number) {
    return await this.calendarService.getUserEventById(eventId);
  }

  // 유저 이벤트 생성 API
  @Post('/users')
  @UseGuards(JwtAuthGuard)
  async createUserEvent(@GetUser() user, @Body() data: UserEventDto) {
    const userId = user.id;
    return await this.calendarService.createUserEvent(userId, data);
  }

  // 그룹 이벤트 생성 API
  @Post('/groups/:groupId')
  @UseGuards(JwtAuthGuard)
  async createGroupEvent(
    @GetUser() user,
    @Param('groupId') groupId: number,
    @Body() data: GroupEventDto,
  ) {
    const userId = user.id;
    return await this.calendarService.createGroupEvent(userId, groupId, data);
  }

  // 그룹 이벤트 리스트 API
  @Get('/groups/:groupId/events')
  @UseGuards(JwtAuthGuard)
  async getGroupEvent(@GetUser() user, @Param('groupId') groupId: number) {
    const userId: number = user.id;
    return await this.calendarService.getGroupEvent(userId, groupId);
  }
  // 그룹 이벤트 상세 보기 API
  @Get('/groups/:groupId/events/:eventId')
  @UseGuards(JwtAuthGuard)
  async getGroupEventDetail(
    @GetUser() user,
    @Param('eventId') eventId: number,
    @Param('groupId') groupId: number,
  ) {
    const userId: number = user.id;
    return await this.calendarService.getGroupEventDetail(
      userId,
      groupId,
      eventId,
    );
  }

  @Put('/uevents/:id')
  updateUserEvent(
    @Param('id') eventId: number,
    @Body() data: UpdateUserEventDto,
  ) {
    const userId = 1;
    return this.calendarService.updateUserEvent(userId, eventId, data);
  }

  @Delete('/uevents/:id')
  deleteUserEvent(@Param('id') eventId: number, @Body() data) {
    return this.calendarService.deleteUserEvent(eventId, data.userId);
  }


  @Delete('/gevents/:id')
  deleteGroupEvent(@Param('id') eventId: number, @Body() data) {
    return this.calendarService.deleteGroupEvent(eventId, data.groupId);
  }
}
