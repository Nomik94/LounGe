import { IsNumber, IsString } from 'class-validator';

export class newsfeedCheckDto {
    @IsString()
    content:string;

    @IsNumber()
    userId:number;

    @IsString()
    tag:string;

    @IsString()
    image:string;

}