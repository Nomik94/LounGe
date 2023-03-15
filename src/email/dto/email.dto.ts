import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsString } from 'class-validator';

export class VerifyEmailDTO {
  @IsEmail()
  email: string;

  @IsString()
  checkNumber: string;
}

export class EmailDTO extends PickType(VerifyEmailDTO, ['email']) {}
