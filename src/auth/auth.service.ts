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
import { AuthDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import _ from 'lodash';
import { UserService } from 'src/user/user.service';

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

  async register(authDTO: AuthDTO, file): Promise<void> {
    let filename = 'userImage_logo.png';
    if (file) {
      filename = file.filename;
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

  async login({ user }): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const userEmail = user.email;
    const userId = user.id;

    return await this.getTokens({
      userEmail,
      userId,
    });
  }

  async kakaoLogin(user): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const email = user.email;
    const nickname = user.username;

    const existUser = await this.userService.getByEmail(email);
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

    const userEmail = existUser.email;
    const userId = existUser.id;

    return await this.getTokens({
      userEmail,
      userId,
    });
  }

  async getTokens({ userEmail, userId }): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = await this.getAccessToken({ userEmail, userId });
    const refreshToken = await this.getRefreshToken({ userEmail, userId });

    return { accessToken, refreshToken };
  }

  async getAccessToken({ userEmail, userId }): Promise<string> {
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

  async getRefreshToken({ userEmail, userId }): Promise<string> {
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

  async restoreAccessToken({ accessToken, refreshToken }): Promise<{
    accessToken: string;
  }> {
    await this.jwtService.verifyAsync(accessToken, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
    const userEmail: string = await this.cacheManager.get(refreshToken);

    if (_.isNil(userEmail)) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getByEmail(userEmail);
    const userId = user.id;
    if (_.isNil(user)) {
      throw new NotFoundException();
    }

    const restoreAccessToken = await this.getAccessToken({ userEmail, userId });

    return { accessToken: restoreAccessToken };
  }
}
