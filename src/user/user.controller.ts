import {
  Body,
  Controller,
  Get,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { GetUser } from 'src/common/decorator/get.user.decorator';
import { User } from 'src/database/entities/user.entity';
import { FindPasswordDTO } from './dto/findPassword.dto';
import { ModifyPasswordDTO } from './dto/modifyPassword.dto';
import { ModifyUserDTO } from './dto/modifyUser.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 유저정보 조회 API
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@GetUser() user: IUser): Promise<User> {
    const userId = user.id;
    return await this.userService.getById(userId);
  }

  // 유저이미지 및 유저네임 조회 API
  @Get('select')
  @UseGuards(JwtAuthGuard)
  async getUserImageAndUsername(@GetUser() user: IUser) {
    const userId = user.id;
    return await this.userService.getUserImageAndUsername(userId);
  }

  // 유저네임 수정 API
  @Put('modify/name')
  @UseGuards(JwtAuthGuard)
  async ModifyUserName(
    @GetUser() user: IUser,
    @Body() data: ModifyUserDTO,
  ): Promise<void> {
    return await this.userService.ModifyUserName(user, data);
  }

  // 유저이미지 수정 API
  @Put('modify/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('userImage'))
  async ModifyUserImage(
    @GetUser() user: IUser,
    @UploadedFile() file: Express.MulterS3.File,
  ): Promise<void> {
    return await this.userService.ModifyUserImage(user, file);
  }

  // 패스워드 수정 API
  @Put('modify/password')
  @UseGuards(JwtAuthGuard)
  async ModifyPassword(
    @GetUser() user: IUser,
    @Body() data: ModifyPasswordDTO,
  ): Promise<void> {
    const userId = user.id;
    await this.userService.ModifyPassword(userId, data);
  }

  // 패스워드 찾기 API
  @Put('find/password')
  async findPassword(@Body() data: FindPasswordDTO): Promise<void> {
    return await this.userService.findPassword(data);
  }
}
