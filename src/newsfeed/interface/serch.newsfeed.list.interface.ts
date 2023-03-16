export interface ISerchNewsfeedList {
  id: number;
  content: string;
  createAt: Date;
  updateAt: Date;
  userName: string;
  userEmail: string;
  userImage: string;
  tagsName: string[];
  newsfeedImage: string[];
  groupId: number;
  groupName: string;
}