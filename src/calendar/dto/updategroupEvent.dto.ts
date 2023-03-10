import { IsOptional,IsNumber, IsString, IsDate } from 'class-validator';

export class UpdateGroupEventDto {
  @IsOptional()
  @IsString()
  readonly eventName: string;

  @IsOptional()
  @IsString()
  readonly eventContent: string;

  @IsOptional()
  @IsString()
  readonly start: string;

  @IsOptional()
  @IsString()
  readonly end: string;
}