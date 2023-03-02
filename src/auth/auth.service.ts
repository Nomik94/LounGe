import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { EmailService } from 'src/email/email.service';
import _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly emailService: EmailService,
  ) {}

  async register(authDto: AuthDto): Promise<void> {
    const { email, username, password } = authDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.findOne({ where: { email } });

    if (user) throw new ConflictException('이미 등록된 이메일입니다.');

    await this.userRepository.save({
      email,
      username,
      password: hashedPassword,
    });
  }

  async login({ email, password }): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    const isRegister = await bcrypt.compare(password, user.password);
    if (!user || !isRegister) {
      throw new UnprocessableEntityException(
        '이메일 또는 패스워드가 일치하지 않습니다.',
      );
    }

    const accessToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '1h',
      },
    );
    return { accessToken };
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async sendVerification(email: string): Promise<void> {
    const verifyToken = this.randomNumber();
    await this.cacheManager.set(email, verifyToken);
    await this.emailService.sendVerifyToken(email, verifyToken);
  }

  async verifyEmail(email: string, verifyToken: number): Promise<void> {
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
