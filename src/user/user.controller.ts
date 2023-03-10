import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { FindPasswordDTO } from './dto/findPassword.dto';
import { UpdatePasswordDTO } from './dto/updatePassword.dto';
import { UserUpdateDTO } from './dto/updateUser.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @GetUser() user,
    @Body() data: UserUpdateDTO,
  ): Promise<void> {
    const userId = user.id;
    await this.userService.updateUser({ userId, data });
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @GetUser() user,
    @Body() data: UpdatePasswordDTO,
  ): Promise<void> {
    const userId = user.id;
    await this.userService.updatePassword({ userId, data });
  }

  @Put('findPassword')
  async findPassword(@Body() data: FindPasswordDTO): Promise<void> {
    return await this.userService.findPassword(data);
  }
}
