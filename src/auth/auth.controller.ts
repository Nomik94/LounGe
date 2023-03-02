import { Put, Query } from '@nestjs/common';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, LogInBodyDTO } from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() authDto: AuthDto): Promise<void> {
    return this.authService.register(authDto);
  }

  @Post('login')
  async login(@Body() body: LogInBodyDTO, @Res() res: Response): Promise<void> {
    const { email, password } = body;

    const jwt = await this.authService.login({ email, password });
    res.setHeader('Authorization', `Bearer ${jwt.accessToken}`);
    res.cookie('accessToken', jwt.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
    res.json({ message: 'success' });
  }

  @Post('logout')
  logout(@Res() res: Response): void {
    res.cookie('accessToken', '', {
      maxAge: 0,
    });
    res.json({ message: 'success' });
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
}
