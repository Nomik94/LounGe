import { IsNumber, IsString, IsDate } from 'class-validator';

export class UserEventDto {
  @IsString()
  eventName: string;

  @IsString()
  eventContent: string;

  @IsString()
  start: string;

  @IsString()
  end: string;

  @IsString()
  lat: string;

  @IsString()
  lng: string;

  @IsString()
  location: string;
}