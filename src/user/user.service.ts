import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ModifyUserDTO } from './dto/modifyUser.dto';
import { ModifyPasswordDTO } from './dto/modifyPassword.dto';
import { FindPasswordDTO } from './dto/findPassword.dto';
import { UserRepository } from 'src/common/repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // 유저 검증
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password'],
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    const isRegister = await bcrypt.compare(password, user.password);

    if (!isRegister) {
      throw new UnauthorizedException(
        '이메일 또는 패스워드가 일치하지 않습니다.',
      );
    }

    return user;
  }

  // 이메일로 유저 조회
  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'password', 'email', 'image'],
    });

    return user;
  }

  // 유저아이디로 유저 조회
  async getById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'password', 'email', 'image'],
    });

    return user;
  }

  // 유저이미지 및 유저네임 조회
  async getUserImageAndUsername(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['username', 'image'],
    });

    return user;
  }

  // 유저네임 수정
  async ModifyUserName(user: IUser, data: ModifyUserDTO): Promise<void> {
    const userId = user.id;
    const userCheck = await this.getById(userId);

    if (!userCheck) throw new UnauthorizedException('권한이 존재하지 않습니다');

    await this.userRepository.update(userId, { username: data.username });
  }

  // 유저이미지 수정
  async ModifyUserImage(
    user: IUser,
    file: Express.MulterS3.File,
  ): Promise<void> {
    const userId = user.id;
    const userCheck = await this.getById(userId);

    if (!userCheck) throw new UnauthorizedException('권한이 존재하지 않습니다');

    const filename = file.key;
    await this.userRepository.update(userId, { image: filename });
  }

  // 패스워드 수정
  async ModifyPassword(userId: number, data: ModifyPasswordDTO): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['password', 'id'],
    });
    const pass = data.password;
    const newPassword = data.newPassword;
    if (!user) {
      throw new UnauthorizedException('권한이 존재하지 않습니다');
    }

    const isRegister = await bcrypt.compare(pass, user.password);

    if (!isRegister) {
      throw new BadRequestException('패스워드가 일치하지 않습니다');
    }

    const password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password });
  }

  // 패스워드 찾기
  async findPassword(data: FindPasswordDTO): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
      select: ['password', 'id'],
    });
    const newPassword = data.password;
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다');
    }

    const checkPassword = await bcrypt.compare(newPassword, user.password);
    if (checkPassword) {
      throw new BadRequestException('기존 비밀번호와 동일합니다');
    }

    const password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, { password });
  }
}
