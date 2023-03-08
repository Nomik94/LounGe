import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('api/emailVerify')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async sendVerifyEmail(@Body() body): Promise<void> {
    return await this.emailService.sendVerification(body.email);
  }

  @Post('check')
  async verifyEmail(@Body() body): Promise<{
    message: string;
  }> {
    console.log(body);

    const verifyToken = parseInt(body.checkNumber);
    const email = body.email;

    await this.emailService.verifyEmail({ email, verifyToken });
    return { message: '인증이 완료되었습니다.' };
  }
}
