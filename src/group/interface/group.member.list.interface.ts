import { Group } from 'src/database/entities/group.entity';

export interface IMemberList {
  userId: number;
  groupId: number;
  userName: string;
  userEmail: string;
  userImage: string;
  userRole: string;
}
