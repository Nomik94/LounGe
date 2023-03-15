import { IsString, MaxLength, IsOptional } from 'class-validator';

export class ModifyGroupDto {
  @IsOptional()
  @IsString()
  @MaxLength(15, { message: '그룹 이름은 최대 15글자입니다.' })
  groupName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '그룹 설명은 최대 50글자입니다.' })
  description: string;

  @IsOptional()
  @IsString()
  tag: string | null;

  @IsOptional()
  groupImage: string | null;

  @IsOptional()
  backgroundImage: string | null;
}
