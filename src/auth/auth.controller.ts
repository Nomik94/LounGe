import { Body, Controller, Post } from '@nestjs/common';

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
  async login(@Body() body: LogInBodyDTO) {
    const { email, password } = body;
    return this.authService.login({ email, password });
  }
}
