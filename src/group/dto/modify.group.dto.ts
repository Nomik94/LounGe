import { IsString, MaxLength, IsOptional } from 'class-validator';

export class ModifyGroupDto {
  @IsOptional()
  @IsString()
  @MaxLength(15)
  groupName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  description: string;

  @IsOptional()
  @IsString()
  tag: string | null;

  @IsOptional()
  groupImage: string | null;

  @IsOptional()
  backgroundImage: string | null;
}