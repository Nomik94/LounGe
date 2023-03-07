import { Get, UseGuards } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { AuthService } from './auth.service';
import { AuthDTO, KakaoLoginDTO, LogInBodyDTO } from './dto/auth.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@GetUser() authDTO: AuthDTO): Promise<void> {
    return this.authService.register(authDTO);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@GetUser() user: LogInBodyDTO): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return await this.authService.login({
      user,
    });
  }

  @Get('login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(@GetUser() user: KakaoLoginDTO): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return await this.authService.kakaoLogin(user);
  }

  @Post('restoreAccessToken')
  @UseGuards(JwtRefreshGuard)
  async restoreAccessToken(@Body() body): Promise<{
    accessToken: string;
  }> {
    const accessToken = body.accessToken;
    const refreshToken = body.refreshToken;

    return await this.authService.restoreAccessToken({
      accessToken,
      refreshToken,
    });
  }
}
