import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MaxLength(10)
  groupName: string;

  @IsString()
  @MaxLength(40)
  description: string;

  @IsOptional()
  @IsString()
  tag: string | null;
}
