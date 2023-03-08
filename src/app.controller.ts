import { Controller, Get } from '@nestjs/common';
import { Render, UseGuards } from '@nestjs/common/decorators';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { GetUser } from './common/decorator/get-user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  @Render('newsfeed')
  newsfeed() {}

  @Get('/groups')
  @Render('groups')
  group() {}

  @Get('/events')
  @Render('events')
  event() {}

  @Get('/auth')
  @Render('auth')
  auth() {}

  @Get('/group/management')
  @Render('hub-group-management')
  groupManagement() {}
}
