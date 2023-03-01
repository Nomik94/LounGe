import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const RegisterServiceProvider = {
      provide: AuthService,
      useFactory: () => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        register: jest.fn(() => {}),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, RegisterServiceProvider],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('register', async () => {
      const myData = { email: 'a@a.com', password: '1234', username: '철수' };

      controller.register(myData);
      expect(authService.register).toBeCalledTimes(1);
    });
  });
});
