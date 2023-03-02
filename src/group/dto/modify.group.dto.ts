import { IsString, MaxLength, MinLength, IsOptional, IsArray } from 'class-validator';

export class ModifyGroupDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  @MinLength(1)
  groupName: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  groupImage: string;

  @IsOptional()
  @IsString()
  backgroundImage: string;

  @IsOptional()
  @IsArray()
  tag: string[];
}