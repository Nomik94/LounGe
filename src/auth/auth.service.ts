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
import { AuthDTO } from './dto/auth.dto';
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

  async register(authDTO: AuthDTO): Promise<void> {
    const { email, username, password } = authDTO;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.findOne({ where: { email } });

    if (user) throw new ConflictException('이미 등록된 이메일입니다.');

    await this.userRepository.save({
      email,
      username,
      password: hashedPassword,
    });
  }

  async login({ email, password }) {
    const user = await this.userRepository.findOne({ where: { email } });

    const isRegister = await bcrypt.compare(password, user.password);

    if (!user || !isRegister) {
      throw new UnprocessableEntityException(
        '이메일 또는 패스워드가 일치하지 않습니다.',
      );
    }

    const userEmail = user.email;
    const userId = user.id;

    return await this.getTokens({
      userEmail,
      userId,
    });
  }

  async getAccessToken({ userEmail, userId }) {
    const payload = {
      sub: userId,
      email: userEmail,
    };

    const accessToken = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '1h',
    });

    return accessToken;
  }

  async getRefreshToken({ userEmail, userId }) {
    const payload = {
      sub: userId,
      email: userEmail,
    };
    const refreshTokenExpiresIn = this.configService.get('REFRESH_EXPIRES_IN');

    const refreshToken = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshTokenExpiresIn,
    });
    await this.cacheManager.set(refreshToken, payload.email, {
      ttl: refreshTokenExpiresIn,
    });

    return refreshToken;
  }

  async getTokens({ userEmail, userId }) {
    const accessToken = await this.getAccessToken({ userEmail, userId });
    const refreshToken = await this.getRefreshToken({ userEmail, userId });

    return { accessToken, refreshToken };
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async validateUser({ email, password }) {
    const user = await this.userRepository.findOne({ where: { email } });

    const isRegister = await bcrypt.compare(password, user.password);

    if (user && isRegister) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async sendVerification(email: string): Promise<void> {
    const verifyToken = this.randomNumber();
    await this.cacheManager.set(email, verifyToken, { ttl: 300 });
    await this.emailService.sendVerifyToken(email, verifyToken);
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

  async kakaoLogin(user) {
    const email = user.email;
    const nickname = user.username;

    const existUser = await this.getByEmail(email);
    if (!existUser) {
      const newUser = await this.userRepository.save({
        username: nickname,
        email: email,
      });
      const userEmail = newUser.email;
      const userId = newUser.id;
      return await this.getTokens({
        userEmail,
        userId,
      });
    }
    const userEmail = user.email;
    const userId = user.id;
    return await this.getTokens({
      userEmail,
      userId,
    });
  }

  async restoreAccessToken({ accessToken, refreshToken }) {
    await this.jwtService.verifyAsync(accessToken, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
    const userEmail: string = await this.cacheManager.get(refreshToken);

    if (_.isNil(userEmail)) {
      throw new UnauthorizedException();
    }

    const user = await this.getByEmail(userEmail);
    const userId = user.id;
    if (_.isNil(user)) {
      throw new NotFoundException();
    }

    const restoreAccessToken = await this.getAccessToken({ userEmail, userId });

    return { accessToken: restoreAccessToken };
  }
}
