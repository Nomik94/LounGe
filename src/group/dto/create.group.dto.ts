import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MaxLength(15)
  groupName: string;

  @IsString()
  @MaxLength(50)
  description: string;

  @IsOptional()
  @IsString()
  tag: string | null;
}
