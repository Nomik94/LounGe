import { IsNumber, IsOptional } from "class-validator";
import { newsfeedCheckDto } from "./newsfeed.check.dto";

export class CreateNewsfeedDto {

  @IsOptional()
  readonly file: Array<Express.Multer.File>;
  
  readonly data: newsfeedCheckDto;

  @IsNumber()
  readonly userId:number

  @IsNumber()
  readonly groupId:number
  
}