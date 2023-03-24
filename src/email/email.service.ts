import {
  BadRequestException,
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
import { UserService } from 'src/user/user.service';

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
    private readonly userService: UserService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get('SERVICE'),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  // 인증메일 발송
  async sendVerifyToken(
    emailAddress: string,
    signupVerifyToken: number,
  ): Promise<any> {
    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '인증 메일',
      html: `
      인증번호 : ${signupVerifyToken}`,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // 인증번호 생성
  async sendVerification(email: string): Promise<void> {
    const user = await this.userService.getByEmail(email);
    if (user) {
      throw new BadRequestException({ message: '이미 가입된 이메일입니다.' });
    }
    const verifyToken = this.randomNumber();
    await this.cacheManager.set(email, verifyToken, { ttl: 300 });
    await this.sendVerifyToken(email, verifyToken);
  }

  // 이메일 확인
  async verifyEmail(email: string, verifyToken: number): Promise<void> {
    const cacheVerifyToken = await this.cacheManager.get(email);

    if (_.isNil(cacheVerifyToken)) {
      throw new NotFoundException('해당 메일로 전송된 인증번호가 없습니다.');
    } else if (cacheVerifyToken !== verifyToken) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    } else {
      await this.cacheManager.del(email);
    }
  }

  // 인증번호 생성
  private randomNumber(): number {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
