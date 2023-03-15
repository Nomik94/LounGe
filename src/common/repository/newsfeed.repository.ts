import { Injectable } from '@nestjs/common';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class NewsfeedRepository extends Repository<NewsFeed> {
  constructor(private dataSource: DataSource) {
    super(NewsFeed, dataSource.createEntityManager());
  }

  async checkNewsfeed(id:number):Promise<NewsFeed>{
    return await this.findOne({
      relations: ['user'],
      where: {id:id}
  })
  }   

  async deleteNewsfeed(id:number):Promise<void>{
    await this.softDelete(id)
  }

  async createNewsfeed(content:string,userId:number):Promise<NewsFeed>{
    return await this.save({
      content:content,
      user: {id : userId},
    })
  }

  async modifyNewsfeedContent(id:number,content:string):Promise<void>{
    await this.update(id,
      {content:content}
  );
  }

  async findNewsfeedByTag(numberingId:object[]):Promise<NewsFeed[]>{
    return await this.find({
      relations: ['newsFeedTags.tag','newsImages','user','groupNewsFeeds.group'],
      where: numberingId
    })
  }

  async findnewsfeedByNewsfeedId(newsfeedIds:number[],page:number,pageSize:number):Promise<NewsFeed[]>{
    return await this.find({
      relations: ['newsFeedTags.tag','newsImages','user','groupNewsFeeds.group'],
      select: ['id', 'content', 'createdAt', 'updatedAt'],
      where: { id: In(newsfeedIds), deletedAt: null },
      order: {createdAt: 'desc' },
      take: pageSize,
      skip: pageSize * (page - 1)
    })
  }

  async findnewsfeedByUserId(userId:number,page:number,pageSize:number):Promise<NewsFeed[]>{
    return await this.find({
      relations: ['newsFeedTags.tag','newsImages','user','groupNewsFeeds.group'],
      select: ['id','content','createdAt','updatedAt'],
      where:{'user' : {id:userId}, deletedAt: null},
      order: {createdAt: 'desc' },
      take: pageSize,
      skip: pageSize * (page - 1)
    })
  }

}
