import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('emailVerify')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async sendVerifyEmail(@Body() body): Promise<void> {
    return await this.emailService.sendVerification(body.email);
  }

  @Put()
  async verifyEmail(
    @Body() body,
    @Query() query,
  ): Promise<{
    message: string;
  }> {
    const verifyToken = parseInt(query.verifyToken);
    const email = body.email;

    await this.emailService.verifyEmail({ email, verifyToken });
    return { message: '인증이 완료되었습니다.' };
  }
}
