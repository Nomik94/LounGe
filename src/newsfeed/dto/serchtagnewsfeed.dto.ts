import { IsString } from 'class-validator';

export class serchtagnewsfeedCheckDto {
  @IsString()
  tag: string;
}
