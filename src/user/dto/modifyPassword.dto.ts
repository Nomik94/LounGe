import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { AuthDTO } from 'src/auth/dto/auth.dto';

export class ModifyPasswordDTO extends PickType(AuthDTO, ['password']) {
  @IsNotEmpty()
  @IsString()
  @MinLength(4, { message: '패스워드는 최소 4글자입니다.' })
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '알파벳과 영어 조합으로 해주세요',
  })
  newPassword: string;
}
