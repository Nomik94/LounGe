import { IsNumber, IsString, IsDate } from 'class-validator';

export class UserEventDto {
  @IsString()
  readonly eventName: string;

  @IsString()
  readonly eventContent: string;

  @IsString()
  readonly start: string;

  @IsString()
  readonly end: string;
}