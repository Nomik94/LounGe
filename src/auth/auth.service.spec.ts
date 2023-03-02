import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';

class MockUserRepository {
  myDb = [{ email: 'a@a.com', password: '1234', username: '짱구' }];
  findOne({ where: { email } }) {
    const user = this.myDb.filter((el) => el.email === email);
    if (user.length) {
      return user[0];
    }
    return null;
  }
  save({ email, password, username }) {
    this.myDb.push({ email, password, username });
    return { email, password, username };
  }
}

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthService', () => {
  let userService: AuthService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useClass: MockUserRepository },
      ],
    }).compile();

    userService = module.get<AuthService>(AuthService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('이미 존재하는 이메일 검증', async () => {
    const userRepositorySpySave = jest.spyOn(userRepository, 'save');
    const userRepositorySpyFindOne = jest.spyOn(userRepository, 'findOne');

    const myData = {
      email: 'a@a.com',
      password: '1234',
      username: '철수',
    };
    try {
      await userService.register({ ...myData });
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
    }
    expect(userRepositorySpyFindOne).toBeCalledTimes(1);
    expect(userRepositorySpySave).toBeCalledTimes(0);
  });

  it('회원 등록 검증', async () => {
    const userRepositorySpySave = jest.spyOn(userRepository, 'save');
    const userRepositorySpyFindOne = jest.spyOn(userRepository, 'findOne');

    const myData = {
      email: 'b@b.com',
      password: '1234',
      username: '철수',
    };

    await userService.register({ ...myData });
    expect(userRepositorySpyFindOne).toBeCalledTimes(1);
    expect(userRepositorySpySave).toBeCalledTimes(1);
  });
});