import { IsString } from 'class-validator';

export class FindGroupTagDto {
  @IsString()
  tag: string;
}
