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
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { GetUser } from 'src/common/decorator/get.user.decorator';
import { UpdateUserEventDto } from './dto/updateUserEvent.dto';
import { UpdateGroupEventDto } from './dto/updategroupEvent.dto';

@Controller('/api/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  // 전체 이벤트 리스트 API
  @Get('/events')
  @UseGuards(JwtAuthGuard)
  async getAllEvent(@GetUser() user) {
    const userId = user.id;
    return await this.calendarService.getAllEvent(userId);
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

  // 유저 이벤트 상세 보기 API
  @Get('/users/:currId/events/:eventId')
  @UseGuards(JwtAuthGuard)
  async getUserEventDetail(
    @GetUser() user,
    @Param('eventId') eventId: number,
    @Param('currId') currId: number,
  ) {
    const userId: number = user.id;
    console.log(userId, currId);
    return await this.calendarService.getUserEventDetail(
      userId,
      currId,
      eventId,
    );
  }

  // 유저 이벤트 삭제 API
  @Delete('/users/events/:eventId')
  @UseGuards(JwtAuthGuard)
  async deleteUserEvent(@GetUser() user, @Param('eventId') eventId: number) {
    const userId = user.id;
    console.log(userId, eventId);
    await this.calendarService.deleteUserEvent(userId, eventId);
  }

  // 그룹 이벤트 삭제 API
  @Delete('/groups/events/:eventId')
  @UseGuards(JwtAuthGuard)
  async deleteGroupEvent(@GetUser() user, @Param('eventId') eventId: number) {
    const userId = user.id;
    console.log(userId, eventId);
    await this.calendarService.deleteGroupEvent(userId, eventId);
  }

  // @Put('/uevents/:id')
  // updateUserEvent(
  //   @Param('id') eventId: number,
  //   @Body() data: UpdateUserEventDto,
  // ) {
  //   const userId = 1;
  //   return this.calendarService.updateUserEvent(userId, eventId, data);
  // }
}
