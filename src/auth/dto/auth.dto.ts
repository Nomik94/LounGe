import { PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '알파벳과 영어 조합으로 해주세요',
  })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(10)
  username: string;
}

export class LogInBodyDTO extends PickType(AuthDto, ['email', 'password']) {}
