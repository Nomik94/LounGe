import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class modifyNewsfeedCheckDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @Length(1, 5, { each: true })
  tag: Array<string> | null | string;
}
