import { Injectable } from '@nestjs/common';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class NewsfeedRepository extends Repository<NewsFeed> {
  constructor(private dataSource: DataSource) {
    super(NewsFeed, dataSource.createEntityManager());
  }

  checkNewsfeed(id:number){
    return this.findOne({
      relations: ['user'],
      where: {id:id}
  })
  }   

  deleteNewsfeed(id:number){
    return this.softDelete(id)
  }

  createNewsfeed(content:any,userId:number){
    return this.save({
      content:content,
      user: {id : userId},
    })
  }

  modifyNewsfeedContent(id:number,content:any){
    return this.update(id,
      {content:content}
  );
  }

  findNewsfeedByTag(numberingId:any){
    return this.find({
      relations: ['newsFeedTags.tag','newsImages','user','groupNewsFeeds.group'],
      where: numberingId
    })
  }

  findnewsfeedByNewsfeedId(newsfeedIds:any){
    return this.find({
      relations: ['newsFeedTags.tag','newsImages','user','groupNewsFeeds.group'],
      select: ['id', 'content', 'createdAt', 'updatedAt'],
      where: { id: In(newsfeedIds), deletedAt: null }
    })
  }

  findnewsfeedByUserId(userId:number){
    return this.find({
      relations: ['newsFeedTags.tag','newsImages','user','groupNewsFeeds.group'],
      select: ['id','content','createdAt','updatedAt'],
      where:{'user' : {id:userId}, deletedAt: null}
    })
  }

}
