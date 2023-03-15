import { IsString, IsArray, IsOptional, Length } from 'class-validator';

export class newsfeedCheckDto {
    @IsString({message:"빈 내용은 입력할 수 없습니다."})
    readonly content:string;

    @IsOptional()
    @IsArray()
    @Length(1, 5, { each: true, message:"태그는 최소 1, 최대 5글자입니다."})
    readonly tag: Array<string> | null | string;
}