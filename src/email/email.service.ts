import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { Cache } from 'cache-manager';
import _ from 'lodash';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get('SERVICE'),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendVerifyToken(
    emailAddress: string,
    signupVerifyToken: number,
  ): Promise<any> {
    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `

      인증번호 : ${signupVerifyToken}`,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendVerification(email: string): Promise<void> {
    const verifyToken = this.randomNumber();
    await this.cacheManager.set(email, verifyToken, { ttl: 300 });
    await this.sendVerifyToken(email, verifyToken);
  }

  async verifyEmail({ email, verifyToken }): Promise<void> {
    const cacheVerifyToken = await this.cacheManager.get(email);

    if (_.isNil(cacheVerifyToken)) {
      throw new NotFoundException('해당 메일로 전송된 인증번호가 없습니다.');
    } else if (cacheVerifyToken !== verifyToken) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    } else {
      await this.cacheManager.del(email); // 인증이 완료되면 del을 통해 삭제
    }
  }

  private randomNumber(): number {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
