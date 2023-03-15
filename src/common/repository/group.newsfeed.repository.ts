import { Injectable } from '@nestjs/common';
import { GroupNewsFeed } from 'src/database/entities/group-newsfeed.entity';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class GroupNewsfeedRepository extends Repository<GroupNewsFeed> {
  constructor(private dataSource: DataSource) {
    super(GroupNewsFeed, dataSource.createEntityManager());
  }

  async deleteNewsfeedGroup(id:number):Promise<void> {
    await this.delete({newsFeedId:id})
  }

  async createNewsfeed(newsfeedId:number,groupId:number):Promise<void>{
    await this.insert({
      newsFeedId: newsfeedId,
      groupId: groupId
  })
  }

  async serchNewsfeedIdByGroupId(groupId:number):Promise<Array<{newsFeedId:number}>>{
    return await this.find({
      where: {'groupId' :groupId},
      select: ['newsFeedId']
    })
  }

  async serchNewsfeedIdByGroupIdArray(groupIds:number[]):Promise<Array<{newsFeedId:number}>>{
    return await this.find({
      where: { groupId: In(groupIds) },
      select: ['newsFeedId']
    })
  }
}
