import { PickType } from '@nestjs/mapped-types';
import { CreateGroupEventDto } from './create-groupEvent.dto';

export class DeleteGroupEventDto extends PickType(CreateGroupEventDto, [
  'groupId',
] as const) {}