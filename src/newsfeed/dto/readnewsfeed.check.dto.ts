import { IsNumber } from 'class-validator';

export class readNewsfeedCheckDto {
    @IsNumber()
    userId:number;
}