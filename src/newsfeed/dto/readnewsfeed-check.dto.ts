import { IsNumber, IsString } from 'class-validator';

export class readNewsfeedCheckDto {
    @IsNumber()
    userId:number;
}