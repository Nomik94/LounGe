import { IsString, MaxLength, MinLength, IsOptional, IsArray } from 'class-validator';

export class ModifyGroupDto {
  @IsOptional()
  @IsString()
  @MaxLength(15)
  @MinLength(1)
  groupName: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  tag: string | null;
}