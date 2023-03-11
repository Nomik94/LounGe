import { PickType } from '@nestjs/mapped-types';
import { AuthDTO } from 'src/auth/dto/auth.dto';

export class UserUpdateDTO extends PickType(AuthDTO, ['username']) {}
