import { PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthDTO {
  @IsNotEmpty()
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4, { message: '패스워드는 최소 4글자입니다.' })
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '알파벳과 영어 조합으로 해주세요.',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: '닉네임은 최소 2글자입니다.' })
  @MaxLength(10, { message: '닉네임은 최대 10글자입니다.' })
  username: string;
}

export class LogInBodyDTO extends PickType(AuthDTO, ['email', 'password']) {}

export class KakaoLoginDTO extends PickType(AuthDTO, ['email', 'username']) {}
