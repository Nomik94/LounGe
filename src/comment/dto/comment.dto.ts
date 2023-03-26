import { IsString } from 'class-validator';

export class CommentDTO {
  @IsString()
  content: string;

  groupId: number | undefined;
}
