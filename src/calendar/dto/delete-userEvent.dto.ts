import { PickType } from '@nestjs/mapped-types';
import { CreateUserEventDto } from './create-userEvent.dto';

export class DeleteUserEventDto extends PickType(CreateUserEventDto, [
  'userId',
] as const) {}