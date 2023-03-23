import { Injectable } from '@nestjs/common';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class NewsfeedRepository extends Repository<NewsFeed> {
  constructor(private dataSource: DataSource) {
    super(NewsFeed, dataSource.createEntityManager());
  }

  async checkNewsfeed(id: number): Promise<NewsFeed> {
    return await this.findOne({
      relations: ['user'],
      where: { id: id },
    });
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
  ): Promise<NewsFeed[]> {
    return await this.find({
      relations: ['newsFeedTags.tag', 'newsImages', 'user', 'group', 'comment'],
      order: { createdAt: 'desc' },
      where: {
        id: In(numberNewsfeedIdArray),
        group: { id: groupId },
        deletedAt: null,
      },
    });
  }

  async findNewsfeedByTag(
    serchNewsfeedId: number[],
    userId: number,
    groupIds: number[],
  ): Promise<NewsFeed[]> {
    return await this.find({
      relations: ['newsFeedTags.tag', 'newsImages', 'user', 'group', 'comment'],
      order: { createdAt: 'desc' },
      where: {
        id: In(serchNewsfeedId),
        user: { id: userId },
        group: { id: In(groupIds) },
      },
    });
  }

  async findNewsfeedByGroupId(
    newsfeedSerchId: number[],
    groupIds: number[],
  ): Promise<NewsFeed[]> {
    return await this.find({
      relations: ['newsFeedTags.tag', 'newsImages', 'user', 'group', 'comment'],
      where: { id: In(newsfeedSerchId), group: { id: In(groupIds) } },
      order: { createdAt: 'desc' },
    });
  }

  async findnewsfeedByNewsfeedId(
    groupId: number,
    page: number,
    pageSize: number,
  ): Promise<NewsFeed[]> {
    return await this.find({
      relations: ['newsFeedTags.tag', 'newsImages', 'user', 'group', 'comment'],
      select: ['id', 'content', 'createdAt', 'updatedAt'],
      where: { group: { id: groupId }, deletedAt: null },
      order: { createdAt: 'desc' },
      take: pageSize,
      skip: pageSize * (page - 1),
    });
  }

  async findnewsfeedByUserId(
    userId: number,
    groupIds: number[],
    page: number,
    pageSize: number,
  ): Promise<NewsFeed[]> {
    return await this.find({
      relations: ['newsFeedTags.tag', 'newsImages', 'user', 'group', 'comment'],
      select: ['id', 'content', 'createdAt', 'updatedAt'],
      where: {
        user: { id: userId },
        group: { id: In(groupIds) },
        deletedAt: null,
      },
      order: { createdAt: 'desc' },
      take: pageSize,
      skip: pageSize * (page - 1),
    });
  }

  async findnewsfeedByGroupId(
    groupIds: number[],
    page: number,
    pageSize: number,
  ) {
    return await this.find({
      relations: ['newsFeedTags.tag', 'newsImages', 'user', 'group', 'comment'],
      select: ['id', 'content', 'createdAt', 'updatedAt'],
      where: { group: { id: In(groupIds) }, deletedAt: null },
      order: { createdAt: 'desc' },
      skip: pageSize * (page - 1),
      take: pageSize,
    });
  }

  async checkGroudByNewsfeedId(newsfeedId: number) {
    return await this.createQueryBuilder('newsfeed')
      .select(['newsfeed.id', 'group.id', 'user.id'])
      .leftJoin('newsfeed.group', 'group')
      .leftJoin('newsfeed.user', 'user')
      .where('newsfeed.id=:id', { id: newsfeedId })
      .getOne();
  }
}
