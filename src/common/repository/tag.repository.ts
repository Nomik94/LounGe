import { Injectable } from '@nestjs/common';
import { Tag } from 'src/database/entities/tag.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(private dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }
}
