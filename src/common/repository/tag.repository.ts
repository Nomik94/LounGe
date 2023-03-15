import { Injectable } from '@nestjs/common';
import { Tag } from 'src/database/entities/tag.entity';
import { DataSource, Like, Repository, InsertResult } from 'typeorm';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(private dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }

  async serchTagOne(tag:string):Promise<Tag>{
    return await this.findOneBy({tagName:tag})
  }

  async createTag(tag:string):Promise<void>{
    await this.insert({tagName:tag})
  }

  async serchTagOneForNewsfeed(tag:string):Promise<Tag>{
    return await this.findOne({
      where: {tagName:tag},
      select: ["id"]}
      )
  }

  async serchTagWord(tag:string):Promise<Tag[]>{
    return await this.find({
      where: { tagName: Like(`%${tag}%`) },
      select: ['id']
    })
  }

  async foundTags(tags): Promise<Tag[]> {
    return await this.createQueryBuilder('tag')
      .where('tag.tagName IN (:...tags)', { tags })
      .getMany();
  }

  async createTags(newTagNames): Promise<InsertResult> {
    return await this.createQueryBuilder()
      .insert()
      .into(Tag)
      .values(newTagNames)
      .execute();
  }
}
