import { Body, Controller, Post } from '@nestjs/common';
import { EmailDTO, VerifyEmailDTO } from './dto/email.dto';
import { EmailService } from './email.service';

@Controller('api/emailVerify')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // 인증메일 발송 API
  @Post()
  async sendVerifyEmail(@Body() body: EmailDTO): Promise<void> {
    return await this.emailService.sendVerification(body.email);
  }

  // 인증번호 체크 API
  @Post('check')
  async verifyEmail(@Body() body: VerifyEmailDTO): Promise<{
    message: string;
  }> {
    const verifyToken = parseInt(body.checkNumber);
    const email = body.email;

    await this.emailService.verifyEmail(email, verifyToken);
    return { message: '인증이 완료되었습니다.' };
  }
}
