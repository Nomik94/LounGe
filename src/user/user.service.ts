import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser({ email, password }): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    const isRegister = await bcrypt.compare(password, user.password);

    if (!user || !isRegister) {
      throw new UnauthorizedException(
        '이메일 또는 패스워드가 일치하지 않습니다.',
      );
    }

    return user;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async getById(userId: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async updateUser({ userId, data }): Promise<void> {
    await this.getById(userId);
    await this.userRepository.update(userId, data);
  }

  async updatePassword({ userId, data }): Promise<void> {
    const user = await this.getById(userId);
    const pass = data.password;
    const newPassword = data.newPassword;

    const isRegister = await bcrypt.compare(pass, user.password);

    if (!user || !isRegister) {
      throw new UnauthorizedException('패스워드가 일치하지 않습니다.');
    }

    const password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password });
  }

  async checkPassword(data): Promise<User> {
    const user = await this.getByEmail(data.email);
    const password = data.password;

    const isRegister = await bcrypt.compare(password, user.password);

    if (!user || !isRegister) {
      throw new UnauthorizedException('패스워드가 일치하지 않습니다.');
    }
    return user;
  }

  async findPassword(data): Promise<void> {
    const user = await this.getByEmail(data.email);
    const pass = data.password;

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    const password = await bcrypt.hash(pass, 10);
    await this.userRepository.update(user.id, { password });
  }
}
