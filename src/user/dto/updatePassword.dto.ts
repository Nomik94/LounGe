import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { AuthDTO } from 'src/auth/dto/auth.dto';

export class UpdatePasswordDTO extends PickType(AuthDTO, ['password']) {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '알파벳과 영어 조합으로 해주세요',
  })
  newPassword: string;
}
