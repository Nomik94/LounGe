import { IsString, MaxLength, MinLength, IsNumber } from "class-validator";
import { CreateDateColumn } from "typeorm";

export class CreateGroupDto {
  @IsString()
  @MaxLength(10)
  @MinLength(1)
  groupName : string

  @IsString()
  description: string

  /** multer 사용? s3를 이용해도 multer을 이용하는게 맞을까? 보류 **/

  @IsString()
  groupImage: string

  @IsString()
  backgroundImage: string

  @IsNumber()
  userId : number
}