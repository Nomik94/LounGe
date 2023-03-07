import { IsString, MaxLength, MinLength, IsOptional, IsArray } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MaxLength(10)
  @MinLength(1)
  groupName: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  tag: string | null;
}
