import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';

import { GroupEventDto } from './dto/group.event.dto';
import { UserEventDto } from './dto/user.event.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { GetUser } from 'src/common/decorator/get.user.decorator';
import { IAllEventList } from './interface/event.list.interface';
import { IGroupEventList } from './interface/group.event.list.interface';
import { GroupEvent } from 'src/database/entities/groupEvent.entity';
import { UserEvent } from 'src/database/entities/userEvent.entity';

@Controller('/api/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  // 전체 이벤트 리스트 API
  @Get('/events/:startStr/:endStr')
  @UseGuards(JwtAuthGuard)
  async getAllEvent(
    @GetUser() user: IUser,
    @Param('startStr') startStr,
    @Param('endStr') endStr,
  ) {
    console.log(startStr)
    console.log(endStr)
    const userId = user.id;
    return await this.calendarService.getAllEvent(userId, startStr, endStr);
  }

  // 유저 이벤트 생성 API
  @Post('/users')
  @UseGuards(JwtAuthGuard)
  async createUserEvent(
    @GetUser() user: IUser,
    @Body() data: UserEventDto,
  ): Promise<void> {
    const userId = user.id;
    return await this.calendarService.createUserEvent(userId, data);
  }

  // 그룹 이벤트 생성 API
  @Post('/groups/:groupId')
  @UseGuards(JwtAuthGuard)
  async createGroupEvent(
    @GetUser() user: IUser,
    @Param('groupId') groupId: number,
    @Body() data: GroupEventDto,
  ): Promise<void> {
    const userId = user.id;
    return await this.calendarService.createGroupEvent(userId, groupId, data);
  }

  // 그룹 이벤트 리스트 API
  @Get('/groups/:groupId/events')
  @UseGuards(JwtAuthGuard)
  async getGroupEvent(
    @GetUser() user: IUser,
    @Param('groupId') groupId: number,
  ): Promise<IGroupEventList> {
    const userId: number = user.id;
    return await this.calendarService.getGroupEvent(userId, groupId);
  }

  // 그룹 이벤트 상세 보기 API
  @Get('/groups/:groupId/events/:eventId')
  @UseGuards(JwtAuthGuard)
  async getGroupEventDetail(
    @GetUser() user: IUser,
    @Param('eventId') eventId: number,
    @Param('groupId') groupId: number,
  ): Promise<GroupEvent> {
    const userId: number = user.id;
    return await this.calendarService.getGroupEventDetail(
      userId,
      groupId,
      eventId,
    );
  }

  // 유저 이벤트 상세 보기 API
  @Get('/users/:currId/events/:eventId')
  @UseGuards(JwtAuthGuard)
  async getUserEventDetail(
    @GetUser() user: IUser,
    @Param('eventId') eventId: number,
    @Param('currId') currId: number,
  ): Promise<UserEvent> {
    const userId: number = user.id;
    return await this.calendarService.getUserEventDetail(
      userId,
      currId,
      eventId,
    );
  }

  // 유저 이벤트 삭제 API
  @Delete('/users/events/:eventId')
  @UseGuards(JwtAuthGuard)
  async deleteUserEvent(
    @GetUser() user: IUser,
    @Param('eventId') eventId: number,
  ): Promise<void> {
    const userId = user.id;
    await this.calendarService.deleteUserEvent(userId, eventId);
  }

  // 그룹 이벤트 삭제 API
  @Delete('/groups/events/:eventId')
  @UseGuards(JwtAuthGuard)
  async deleteGroupEvent(
    @GetUser() user: IUser,
    @Param('eventId') eventId: number,
  ): Promise<void> {
    const userId = user.id;
    await this.calendarService.deleteGroupEvent(userId, eventId);
  }
}
