import { Controller, Get } from '@nestjs/common';
import { Render } from '@nestjs/common/decorators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/newsfeed')
  @Render('newsfeed')
  newsfeed() {}

  @Get('/groups')
  @Render('groups')
  group() {}

  @Get('/events')
  @Render('events')
  event() {}

  @Get('')
  @Render('auth')
  auth() {}

  @Get('/group/management')
  @Render('hub-group-management')
  groupManagement() {}

  @Get('/group/management/members')
  @Render('hub-group-members')
  groupMembersManagement(){}

  @Get('/joined/grouplist')
  @Render('hub-group-joinedlist')
  groupJoinedList(){}

  @Get('/group/timeline')
  @Render('group-timeline')
  groupTimeline(){}
}
