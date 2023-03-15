import { Injectable } from '@nestjs/common';
import { Tag } from 'src/database/entities/tag.entity';
import { DataSource, Like, Repository } from 'typeorm';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(private dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }

  serchTagOne(i:any) {
    return this.findOneBy({tagName:i})
  }

  createTag(i:any) {
    return this.insert({tagName:i})
  }

  serchTagOneForNewsfeed(i:any){
    return this.findOne({
      where: {tagName:i},
      select: ["id"]}
      )
  }

  serchTagWord(tag:string) {
    return this.find({
      where: { tagName: Like(`%${tag}%`) },
      select: ['id']
    })
  }

}
