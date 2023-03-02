import { Body, Controller, Post } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterCredentialsDto } from './dto/register-credential.dto';

@Controller('api/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  register(
    @Body() registerCredentialsDto: RegisterCredentialsDto,
  ): Promise<void> {
    return this.registerService.register(registerCredentialsDto);
  }
}
