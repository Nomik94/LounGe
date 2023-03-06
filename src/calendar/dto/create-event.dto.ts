import { IsNumber, IsString, IsDate } from 'class-validator';

export class CreateEventDto {
  @IsString()
  readonly eventName: string;

  @IsString()
  readonly eventContent: string;

  // @IsDate()
  // readonly start: Date;

  // @IsDate()
  // readonly end: Date;

  @IsNumber()
  readonly groupId: number;
}