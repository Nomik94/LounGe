import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Connection from 'mysql2/typings/mysql/lib/Connection';
import { NewsFeedTag } from 'src/database/entities/newsFeed-Tag.entity';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { NewsFeedImage } from 'src/database/entities/newsFeedImage.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { User } from 'src/database/entities/user.entity';
// import { EntityRepository, Repository } from 'typeorm';
import { Repository } from 'typeorm';
import { modiNewsfeedCheckDto } from './dto/modinewsfeed-check.dto';
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

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async postnewsfeed(data: newsfeedCheckDto): Promise<void> {
        const content = data.content;
        const userId = data.userId; // 썬더 클라이언트로 보내는 임시 유저아이디
        const tag = data.tag;
        const image = data.image;

        const newsfeedId = await this.newsfeedRepository.save({
            content:content,
            user: {id : userId},
        })
        if (tag){
            for(const i of tag) {
                if (!await this.tagRepository.findOneBy({tagName:i})) {
                    await this.tagRepository.insert({
                        tagName:i
                    })
                }
            }
    
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
        if (image) {
            for(const i of image) {
                await this.newsfeedImageRepository.save({
                    image:i,
                    newsFeed: {id: newsfeedId.id}
                })
            }
        }

        return
        }

    async readnewsfeed(userId:number) {

        const a = await this.newsfeedRepository.find({
            relations: ['newsFeedTags.tag','newsImages','user'],
            select: ['id','content','createdAt','updatedAt'],
            where:{'user' : {id:userId},'deletedAt': null}
            });
            const userName = a[0].user.username;
            const userImage = a[0].user.image;
            const userEmail = a[0].user.email;
            const tagsname = a[0].newsFeedTags.map(tag => tag.tag.tagName)
            const newsfeedimage = a[0].newsImages.map(image => image.image)

        return a
    }

    async deletenewsfeed(id:number) {
        try {
            const checknewsfeed = await this.newsfeedRepository.findOne({
                where: {id:id}
            })
            if (!checknewsfeed) {
                throw new NotFoundException("이미 삭제되었거나 존재하지 않는 뉴스피드입니다. id:" + id)
            }

            await this.newsfeedRepository.softDelete(id);

        } catch (err){
            console.log("알수 없는 에러가 발생했습니다.", err);
            throw new Error(err)
        }

    }

    async modinewsfeed(id:number,data: modiNewsfeedCheckDto) : Promise<void>{
        const { content,image,tag } = data

        try {
            const checknewsfeed = await this.newsfeedRepository.findOne({
                where: {id:id}
            })
            if (!checknewsfeed) {
                throw new NotFoundException("삭제되었거나 존재하지 않는 뉴스피드입니다. id:" + id)
            }
            

            await this.newsfeedRepository.update(id,
                {content:content}
            );

            if (tag) {
                await this.newsfeedTagRepository.delete({
                    newsFeedId:id
                })

                for(const i of tag) {
                    if (!await this.tagRepository.findOneBy({tagName:i})) {
                        await this.tagRepository.insert({
                            tagName:i
                        })
                    }
                }
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
                        newsFeedId: id
                    })
                }
            }

            if (image) {
                await this.newsfeedImageRepository.delete({
                    newsFeed: {id:id}
                })
                for (const i of image) {
                    await this.newsfeedImageRepository.save({
                        image: i,
                        newsFeed: {id:id}
                    })
                }
            }

            return
        } catch (err){
            console.log("알수 없는 에러가 발생했습니다.", err);
            throw new Error(err)
        }
    }

    async serchtagnewsfeed(tagId:number) {

        const serchtag = await this.newsfeedTagRepository.find({
            where: {tagId:tagId},
            select: ['newsFeedId']
        })

        const serchnewsfeed = serchtag.map(tag => tag.newsFeedId)

        const wherenewsfeedid = serchnewsfeed.map(id => ({id}))

        const findnewsfeed = await this.newsfeedRepository.find({
            relations: ['newsFeedTags.tag','newsImages','user'],
            where: wherenewsfeedid
        })

        const result = [];

        for (const id of serchnewsfeed) {
            const feed = findnewsfeed.find(item => item.id ===id);
            if (feed) {
                const obj = {
                    newsfeedid: feed.id,
                    newsfeedcontent: feed.content,
                    newsfeedcreateat: feed.createdAt,
                    newsfeedupdateat: feed.updatedAt,
                    username: feed.user.username,
                    userimage: feed.user.image,
                    tagname: feed.newsFeedTags.map(tag => tag.tag.tagName),
                    newsfeedimage : feed.newsImages.map(image => image.image)
                }
                result.push(obj)
            }
        }
        // for (const i of serchnewsfeed) {
        //     const newsfeedid = findnewsfeed[i].id
        //     const newsfeedcontent = findnewsfeed[i].content
        //     const newsfeedcreateat = findnewsfeed[i].createdAt
        //     const newsfeedupdateat = findnewsfeed[i].updatedAt
        //     const username = findnewsfeed[i].user.username
        //     const userImage = findnewsfeed[i].user.image
        //     const tagname = findnewsfeed[i].newsFeedTags.map(tag => tag.tag.tagName)
        //     const newfeedimage = findnewsfeed[i].newsImages.map(image => image.image)
        // }

        return result
    }
}

