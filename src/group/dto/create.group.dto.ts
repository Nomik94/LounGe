import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsString({ message: '그룹 이름은 필수 입력 사항입니다.' })
  @MaxLength(15, { message: '그룹 이름은 최대 15글자입니다.' })
  @MinLength(1, { message: '그룹 이름은 최소 1글자입니다.' })
  groupName: string;

  @IsString()
  @MaxLength(50, { message: '그룹 설명은 최대 50글자입니다.' })
  @MinLength(1, { message: '그룹 설명은 최초 1글자입니다.' })
  description: string;

  @IsOptional()
  @IsString()
  tag: string | null;
}
