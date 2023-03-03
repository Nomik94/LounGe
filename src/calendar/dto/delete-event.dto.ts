import { PickType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';

export class DeleteEventDto extends PickType(CreateEventDto, [
  'groupId',
] as const) {}