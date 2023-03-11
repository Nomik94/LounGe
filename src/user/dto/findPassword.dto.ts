import { PickType } from '@nestjs/mapped-types';
import { AuthDTO } from 'src/auth/dto/auth.dto';

export class FindPasswordDTO extends PickType(AuthDTO, ['password', 'email']) {}
