import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupEventDto } from './create-groupEvent.dto';

export class UpdateGroupEventDto extends PartialType(CreateGroupEventDto) {}