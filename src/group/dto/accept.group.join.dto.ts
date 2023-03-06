import { IsNumber } from 'class-validator';

export class AcceptGroupJoinDto {
  @IsNumber()
  groupId: string;

  @IsNumber()
  memberId: string;
}
