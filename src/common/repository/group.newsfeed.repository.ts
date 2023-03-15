import { Injectable } from '@nestjs/common';
import { GroupNewsFeed } from 'src/database/entities/group-newsfeed.entity';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class GroupNewsfeedRepository extends Repository<GroupNewsFeed> {
  constructor(private dataSource: DataSource) {
    super(GroupNewsFeed, dataSource.createEntityManager());
  }

  deleteNewsfeedGroup(id:number){
    return this.delete({newsFeedId:id})
  }

  createNewsfeed(newsfeedId:number,groupId:number){
    return this.insert({
      newsFeedId: newsfeedId,
      groupId: groupId
  })
  }

  serchNewsfeedIdByGroupId(groupId:number){
    return this.find({
      where: {'groupId' :groupId},
      select: ['newsFeedId']
    })
  }

  serchNewsfeedIdByGroupIdArray(groupIds:number[]){
    return this.find({
      where: { groupId: In(groupIds) },
      select: ['newsFeedId']
    })
  }
}