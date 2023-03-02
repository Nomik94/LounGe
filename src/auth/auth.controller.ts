import { ValidationPipe } from '@nestjs/common';
import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, LogInBodyDTO } from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('register')
  register(@Body() authDto: AuthDto): Promise<void> {
    return this.authService.register(authDto);
  }

  @Post('login')
  async login(@Body() body: LogInBodyDTO, @Res() res: Response) {
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
  logout(@Res() res: Response) {
    res.cookie('accessToken', '', {
      maxAge: 0,
    });
    res.json({ message: 'success' });
  }
}
