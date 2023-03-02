import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

describe('RegisterController', () => {
  let controller: RegisterController;
  let registerService: RegisterService;

  beforeEach(async () => {
    const RegisterServiceProvider = {
      provide: RegisterService,
      useFactory: () => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        register: jest.fn(() => {}),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [RegisterService, RegisterServiceProvider],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
    registerService = module.get<RegisterService>(RegisterService);
  });

  describe('register', () => {
    it('register', async () => {
      const myData = { email: 'a@a.com', password: '1234', username: '철수' };

      controller.register(myData);
      expect(registerService.register).toBeCalledTimes(1);
    });
  });
});
