import { Injectable } from '@nestjs/common';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class NewsfeedRepository extends Repository<NewsFeed> {
  constructor(private dataSource: DataSource) {
    super(NewsFeed, dataSource.createEntityManager());
  }

  async checkNewsfeed(NewsfeedId:number): Promise<NewsFeed> {
    return await this.createQueryBuilder('newsfeed')
    .select(['user.id','newsfeed.id'])
    .leftJoin('newsfeed.user','user')
    .where('newsfeed.id =:id', {id:NewsfeedId})
    .getOne()
  }

  async deleteNewsfeed(id: number): Promise<void> {
    await this.softDelete(id);
  }

  async createNewsfeed(
    content: string,
    userId: number,
    groupId: number,
  ): Promise<NewsFeed> {
    return await this.save({
      content: content,
      user: { id: userId },
      group: { id: groupId },
    });
  }

  async modifyNewsfeedContent(id: number, content: string): Promise<void> {
    await this.update(id, { content: content });
  }

  async findNewsfeedByOneGroupId(
    numberNewsfeedIdArray: number[],
    groupId: number,
  ): Promise<any> {
    return await this.createQueryBuilder('newsfeed')
    .select([
      'newsfeed.id',
      'newsfeed.content',
      'newsfeed.createdAt',
      'newsfeed.updatedAt',
      'user.username',
      'user.email',
      'user.image',
      'user.id',
      'group.id',
      'group.groupName',
      'newsImages.image',
      'comment.content',
      'newsFeedTags',
      'tag.tagName'
    ])
    .leftJoin('newsfeed.group','group')
    .leftJoin('newsfeed.user','user')
    .leftJoin('newsfeed.newsImages','newsImages')
    .leftJoin('newsfeed.comment','comment')
    .leftJoin('newsfeed.newsFeedTags','newsFeedTags')
    .leftJoin('newsFeedTags.tag','tag')
    .where('newsfeed.id IN (:...id)', {id:numberNewsfeedIdArray})
    .andWhere('group.id = :groupId', {groupId:groupId})
    .orderBy({'newsfeed.createdAt': "DESC"})
    .getMany()
  }

  async findNewsfeedByTag(
    serchNewsfeedId: number[],
    userId: number,
    groupIds: number[],
  ): Promise<any> {
    return await this.createQueryBuilder('newsfeed')
    .select([
      'newsfeed.id',
      'newsfeed.content',
      'newsfeed.createdAt',
      'newsfeed.updatedAt',
      'user.username',
      'user.email',
      'user.image',
      'user.id',
      'group.id',
      'group.groupName',
      'newsImages.image',
      'comment.content',
      'newsFeedTags',
      'tag.tagName'
    ])
    .leftJoin('newsfeed.group','group')
    .leftJoin('newsfeed.user','user')
    .leftJoin('newsfeed.newsImages','newsImages')
    .leftJoin('newsfeed.comment','comment')
    .leftJoin('newsfeed.newsFeedTags','newsFeedTags')
    .leftJoin('newsFeedTags.tag','tag')
    .where('user.id = :id', {id:userId})
    .andWhere('newsfeed.id IN (:...ids)', {ids:serchNewsfeedId})
    .andWhere('newsfeed.group IN (:...groupId)', {groupId:groupIds})
    .orderBy({'newsfeed.createdAt': "DESC"})
    .getMany()
  }

  async findNewsfeedByGroupId(
    newsfeedSerchId: number[],
    groupIds: number[],
  ): Promise<any> {
    return await this.createQueryBuilder('newsfeed')
    .select([
      'newsfeed.id',
      'newsfeed.content',
      'newsfeed.createdAt',
      'newsfeed.updatedAt',
      'user.username',
      'user.email',
      'user.image',
      'user.id',
      'group.id',
      'group.groupName',
      'newsImages.image',
      'comment.content',
      'newsFeedTags',
      'tag.tagName'
    ])
    .leftJoin('newsfeed.group','group')
    .leftJoin('newsfeed.user','user')
    .leftJoin('newsfeed.newsImages','newsImages')
    .leftJoin('newsfeed.comment','comment')
    .leftJoin('newsfeed.newsFeedTags','newsFeedTags')
    .leftJoin('newsFeedTags.tag','tag')
    .where('newsfeed.id IN (:...ids)', {ids:newsfeedSerchId})
    .andWhere('newsfeed.group IN (:...id)', {id:groupIds})
    .orderBy({'newsfeed.createdAt': "DESC"})
    .getMany()
  }
  
  async findnewsfeedByNewsfeedId(
    groupId: number,
    page: number,
    pageSize: number,
  ): Promise<any> {
    return await this.createQueryBuilder('newsfeed')
    .select([
      'newsfeed.id',
      'newsfeed.content',
      'newsfeed.createdAt',
      'newsfeed.updatedAt',
      'user.username',
      'user.email',
      'user.image',
      'user.id',
      'group.id',
      'group.groupName',
      'newsImages.image',
      'comment.content',
      'newsFeedTags',
      'tag.tagName'
    ])
    .leftJoin('newsfeed.group','group')
    .leftJoin('newsfeed.user','user')
    .leftJoin('newsfeed.newsImages','newsImages')
    .leftJoin('newsfeed.comment','comment')
    .leftJoin('newsfeed.newsFeedTags','newsFeedTags')
    .leftJoin('newsFeedTags.tag','tag')
    .where('group.id = :id', {id:groupId})
    .orderBy({'newsfeed.createdAt': "DESC"})
    .take(pageSize)
    .skip(pageSize * (page - 1))
    .getMany()
  }

  async findnewsfeedByUserId(
    userId: number,
    groupIds: number[],
    page: number,
    pageSize: number,
  ): Promise<any> {
    return await this.createQueryBuilder('newsfeed')
    .select([
      'newsfeed.id',
      'newsfeed.content',
      'newsfeed.createdAt',
      'newsfeed.updatedAt',
      'user.username',
      'user.email',
      'user.image',
      'user.id',
      'group.id',
      'group.groupName',
      'newsImages.image',
      'comment.content',
      'newsFeedTags',
      'tag.tagName'
    ])
    .leftJoin('newsfeed.group','group')
    .leftJoin('newsfeed.user','user')
    .leftJoin('newsfeed.newsImages','newsImages')
    .leftJoin('newsfeed.comment','comment')
    .leftJoin('newsfeed.newsFeedTags','newsFeedTags')
    .leftJoin('newsFeedTags.tag','tag')
    .where('user.id = :id', {id:userId})
    .andWhere('group.id IN (:...groupId)', {groupId:groupIds})
    .orderBy({'newsfeed.createdAt': "DESC"})
    .take(pageSize)
    .skip(pageSize * (page - 1))
    .getMany()
  }
  
  async findnewsfeedByGroupId(
    groupIds:number[],
    page: number,
    pageSize:number
  ):Promise<any> {
    return await this.createQueryBuilder('newsfeed')
    .select([
      'newsfeed.id',
      'newsfeed.content',
      'newsfeed.createdAt',
      'newsfeed.updatedAt',
      'user.username',
      'user.email',
      'user.image',
      'user.id',
      'group.id',
      'group.groupName',
      'newsImages.image',
      'comment.content',
      'newsFeedTags',
      'tag.tagName'
    ])
    .leftJoin('newsfeed.group','group')
    .leftJoin('newsfeed.user','user')
    .leftJoin('newsfeed.newsImages','newsImages')
    .leftJoin('newsfeed.comment','comment')
    .leftJoin('newsfeed.newsFeedTags','newsFeedTags')
    .leftJoin('newsFeedTags.tag','tag')
    .where('newsfeed.group IN (:...ids)', {ids:groupIds})
    .orderBy({'newsfeed.createdAt': "DESC"})
    .take(pageSize)
    .skip(pageSize * (page - 1))
    .getMany()
  }

  async findCommentByNewsfeed(newsfeedId: number) {
    return await this.findOne({
      select: ['id', 'comment'],
      relations: ['comment'],
      where: { id: newsfeedId },
    });
  }
}
