import { Controller, Get } from '@nestjs/common';
import { Query, Render } from '@nestjs/common/decorators';
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
  groupMembersManagement() {}

  @Get('/joined/grouplist')
  @Render('hub-group-joinedlist')
  groupJoinedList() {}

  @Get('/findPassword')
  @Render('findPassword')
  findPassword() {}

  @Get('/account/password')
  @Render('hub-account-password')
  accountPassword() {}

  @Get('/profile/info')
  @Render('hub-profile-info')
  profileInfo() {}

  @Get('/group/timeline')
  @Render('group-timeline')
  async groupTimeline(@Query('groupId') groupId: number) {
    if (!groupId) {
      return;
    }
    return await this.appService.groupInfo(groupId);
  }

  @Get('/group/events')
  @Render('group-events')
  async groupEvents(@Query('groupId') groupId: number) {
    if (!groupId) {
      return;
    }
    return await this.appService.groupInfo(groupId);
  }

  @Get('/group/members')
  @Render('group-members')
  async groupMembers(@Query('groupId') groupId: number) {
    if (!groupId) {
      return;
    }
    return await this.appService.groupInfo(groupId);
  }

  @Get('/newsfeed/mylist')
  @Render('hub-newsfeed-mylist')
  mylist() {}

  @Get('/serchbar/tag')
  @Render('serchnewsfeedtag')
  serchbar() {}
}
