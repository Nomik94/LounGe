import { IsNumber, IsString, IsDate, Min, MinLength, Matches } from 'class-validator';

export class GroupEventDto {
  @IsString()
  @MinLength(1, {message : '일정 제목을 입력해주세요.'})
  eventName: string;

  @IsString()
  @MinLength(1, {message : '일정 내용을 입력해주세요.'})
  eventContent: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: `날짜는 YYYY-MM-DD와 같은 형식으로 입력해주세요.`,
  })
  start: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: `날짜는 YYYY-MM-DD와 같은 형식으로 입력해주세요.`,
  })
  end: string;

  @IsString({message : '모임 장소를 지도에서 클릭해주세요.'})
  lat: string;

  @IsString({message : '모임 장소를 지도에서 클릭해주세요.'})
  lng: string;

  @IsString({message : '모임 장소를 지도에서 클릭해주세요.'})
  location: string;
}