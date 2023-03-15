import { GroupEvent } from "src/database/entities/groupEvent.entity";

export interface IGroupEventList{
  groupInfo: GroupEvent[];
  role: boolean;
}