import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsFeedTag } from 'src/database/entities/newsFeed-Tag.entity';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { NewsFeedImage } from 'src/database/entities/newsFeedImage.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { Repository } from 'typeorm';
import { newsfeedCheckDto } from './dto/newsfeed-check.dto';

@Injectable()
export class NewsfeedService {
    static newsfeed(newsfeed: any) {
      throw new Error('Method not implemented.');
    }
    constructor(

        @InjectRepository(NewsFeed)
        private readonly newsfeedRepository: Repository<NewsFeed>,

        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,

        @InjectRepository(NewsFeedTag)
        private readonly newsfeedTagRepository: Repository<NewsFeedTag>,

        @InjectRepository(NewsFeedImage)
        private readonly newsfeedImageRepository: Repository<NewsFeedImage>,
    ) {}

    async postnewsfeed(data: newsfeedCheckDto): Promise<void> {
        const content = data.content;
        const userId = data.userId; // 썬더 클라이언트로 보내는 임시 유저아이디
        const tag = data.tag;
        const iamge = data.image;

        const newsfeedId = await this.newsfeedRepository.save({
            content:content,
            user: {id : userId},
        })

        for(const i of tag) {
            if (!await this.tagRepository.findOneBy({tagName:i})) {
                await this.tagRepository.insert({
                    tagName:i
                })
            }
        }

        await this.newsfeedImageRepository.save({
            image:iamge,
            newsFeed: {id: newsfeedId.id}
        })

        const serchtag = [];
        for (const i of tag) {
            const a = await this.tagRepository.findOne({
                where: {tagName:i},
                select: ["id"]}
                )
            serchtag.push(a.id);
        }

        for (const i of serchtag) {
            await this.newsfeedTagRepository.save({
                tagId:i,
                newsFeedId: newsfeedId.id
            })
        }
        }
}
