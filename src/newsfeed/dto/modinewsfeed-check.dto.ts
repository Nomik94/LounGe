import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class modiNewsfeedCheckDto {
    @IsString()
    content:string;

    // @IsNumber()
    // userId:number;

    @IsOptional()
    @IsArray()
    tag: Array<string> | null | string;

    // @IsOptional()
    // @IsArray()
    // image:Array<string> | null | string;

}