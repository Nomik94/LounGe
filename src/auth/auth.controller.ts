import {
  Get,
  HttpCode,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { GetUser } from 'src/common/decorator/get.user.decorator';
import { AuthService } from './auth.service';
import { AuthDTO, KakaoLoginDTO, LogInBodyDTO } from './dto/auth.dto';
import { RefreshTokenDTO } from './dto/refreshToken.dto';
import { JwtRefreshGuard } from './guards/jwt.refresh.guard';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입 API
  @Post('register')
  @UseInterceptors(FileInterceptor('userImage'))
  register(
    @Body() authDTO: AuthDTO,
    @UploadedFile() file: Express.MulterS3.File,
  ): Promise<void> {
    return this.authService.register(authDTO, file);
  }

  // 로그인 API
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() user: LogInBodyDTO): Promise<ITokens> {
    return await this.authService.login(user);
  }

  // 카카오로그인 API
  @Get('login/kakao')
  @HttpCode(200)
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(@GetUser() user: KakaoLoginDTO, @Res() res: Response) {
    const tokens = await this.authService.kakaoLogin(user);

    res.redirect(
      `http://loungegroup.site?access=${tokens.accessToken}&refresh=${tokens.refreshToken}`,
    );
  }

  // 엑세스토큰 재발급 API
  @Post('restore/accessToken')
  @UseGuards(JwtRefreshGuard)
  async restoreAccessToken(
    @Body() body: RefreshTokenDTO,
  ): Promise<IAccessToken> {
    const refreshToken = body.refreshToken;
    return await this.authService.restoreAccessToken(refreshToken);
  }
}
