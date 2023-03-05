import { Get, Put, Query, UseGuards } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { AuthService } from './auth.service';
import { AuthDTO, KakaoLoginDTO, LogInBodyDTO } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@GetUser() authDTO: AuthDTO): Promise<void> {
    return this.authService.register(authDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: LogInBodyDTO) {
    const { email, password } = body;

    const { accessToken, refreshToken } = await this.authService.login({
      email,
      password,
    });
    return { accessToken, refreshToken };
  }

  @Post('emailVerify')
  async sendVerifyEmail(@Body() body): Promise<void> {
    return await this.authService.sendVerification(body.email);
  }

  @Put('emailVerify')
  async verifyEmail(@Body() body, @Query() query) {
    const { verifyToken } = query;

    await this.authService.verifyEmail(body.email, parseInt(verifyToken));
    return { message: '인증이 완료되었습니다.' };
  }

  @UseGuards(AuthGuard('kakao'))
  @Get('login/kakao')
  async kakaoLogin(@GetUser() user: KakaoLoginDTO) {
    const { accessToken, refreshToken } = await this.authService.kakaoLogin(
      user,
    );

    return { accessToken, refreshToken };
  }
}
