import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import _ from 'lodash';
import { UserService } from 'src/user/user.service';
import { AuthDTO, KakaoLoginDTO, LogInBodyDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly userService: UserService,
  ) {}

  // 회원가입
  async register(authDTO: AuthDTO, file: Express.MulterS3.File): Promise<void> {
    let filename = 'userImage_logo.png';
    if (file) {
      filename = file.key;
    }
    const { email, username, password } = authDTO;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.findOne({ where: { email } });

    if (user) throw new ConflictException('이미 등록된 이메일입니다.');

    const createUser = await this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      image: filename,
    });

    await this.userRepository.insert(createUser);
  }

  // 로그인
  async login(user: LogInBodyDTO): Promise<ITokens> {
    const userEmail = user.email;
    const loginUser = await this.userService.getByEmail(userEmail);
    const userId = loginUser.id;

    return await this.getTokens(userEmail, userId);
  }

  // 카카오로그인
  async kakaoLogin(user: KakaoLoginDTO) {
    const filename = 'userImage_logo.png';
    const email = user.email;
    const nickname = user.username;

    const existUser = await this.userService.getByEmail(email);
    if (!existUser) {
      const newUser = await this.userRepository.save({
        username: nickname,
        email: email,
        image: filename,
      });
      const userEmail = newUser.email;
      const userId = newUser.id;
      return await this.getTokens(userEmail, userId);
    }

    const userEmail = existUser.email;
    const userId = existUser.id;

    return await this.getTokens(userEmail, userId);
  }

  // 엑세스토큰 및 리프레시토큰 발급
  async getTokens(userEmail: string, userId: number): Promise<ITokens> {
    const accessToken = await this.getAccessToken(userEmail, userId);
    const refreshToken = await this.getRefreshToken(userEmail, userId);

    return { accessToken, refreshToken };
  }

  // 엑세스토큰 발급
  async getAccessToken(userEmail: string, userId: number): Promise<string> {
    const payload = {
      sub: userId,
      email: userEmail,
    };

    const accessToken = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '30m',
    });

    return accessToken;
  }

  // 리프레시토큰 발급
  async getRefreshToken(userEmail: string, userId: number): Promise<string> {
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

  // 엑세스토큰 재발급
  async restoreAccessToken(refreshToken: string): Promise<IAccessToken> {
    const userEmail: string = await this.cacheManager.get(refreshToken);

    if (_.isNil(userEmail)) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getByEmail(userEmail);
    const userId = user.id;
    if (_.isNil(user)) {
      throw new NotFoundException();
    }

    const restoreAccessToken = await this.getAccessToken(userEmail, userId);

    return { accessToken: restoreAccessToken };
  }
}
