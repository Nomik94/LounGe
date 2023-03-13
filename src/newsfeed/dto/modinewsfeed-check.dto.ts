import { IsArray, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class modiNewsfeedCheckDto {
    @IsString()
    content:string;

    // @IsNumber()
    // userId:number;

    @IsOptional()
    @IsArray()
    @Length(1, 5, { each: true })
    tag: Array<string> | null | string;

    // @IsOptional()
    // @IsArray()
    // image:Array<string> | null | string;

}