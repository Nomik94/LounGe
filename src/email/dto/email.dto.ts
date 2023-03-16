import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsString } from 'class-validator';

export class VerifyEmailDTO {
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @IsString()
  checkNumber: string;
}

export class EmailDTO extends PickType(VerifyEmailDTO, ['email']) {}
