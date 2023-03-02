import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterCredentialsDto } from './dto/register-credential.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(
    registerCredentialsDto: RegisterCredentialsDto,
  ): Promise<void> {
    const { email, username, password } = registerCredentialsDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.findOne({ where: { email } });

    if (user) throw new ConflictException('이미 등록된 이메일입니다.');

    await this.userRepository.save({
      email,
      username,
      password: hashedPassword,
    });
  }
}
