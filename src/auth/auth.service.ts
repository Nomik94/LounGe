import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  async login({ email, password }) {
    const user = await this.userRepository.findOne({ where: { email } });
    const isRegister = await bcrypt.compare(password, user.password);
    if (!user || !isRegister) {
      throw new UnprocessableEntityException(
        '이메일 또는 패스워드가 틀렷습니다.',
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
  // 임시 findOne
  async getByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}
