import { IsNumber, IsString, IsArray, IsOptional, Length } from 'class-validator';

export class newsfeedCheckDto {
    @IsString()
    content:string;

    // @IsNumber()
    // userId:number;

    @IsOptional()
    @IsArray()
    @Length(1, 10, { each: true })
    tag: Array<string> | null | string;

    // @IsOptional()
    // @IsArray()
    // image:string;

}