export interface ISerchTagMyNewsfeed {
  id: number;
  content: string;
  createAt: Date;
  updateAt: Date;
  userId: number;
  userName: string;
  userImage: string;
  userEmail: string;
  tagsName: string[];
  newsfeedImage: string[];
  groupId: number[];
  groupName: string[];
}