import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('emailVerify')
  async sendVerifyEmail(@Body() body): Promise<void> {
    return await this.emailService.sendVerification(body.email);
  }

  @Put('emailVerify')
  async verifyEmail(@Body() body, @Query() query) {
    const verifyToken = parseInt(query.verifyToken);
    const email = body.email;

    await this.emailService.verifyEmail({ email, verifyToken });
    return { message: '인증이 완료되었습니다.' };
  }
}
