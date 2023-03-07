import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsFeedTag } from 'src/database/entities/newsFeed-Tag.entity';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { NewsFeedImage } from 'src/database/entities/newsFeedImage.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { User } from 'src/database/entities/user.entity';
// import { EntityRepository, Repository } from 'typeorm';
import { Like, Repository } from 'typeorm';
import { modiNewsfeedCheckDto } from './dto/modinewsfeed-check.dto';
import { newsfeedCheckDto } from './dto/newsfeed-check.dto';
import { serchtagnewsfeedCheckDto } from './dto/serchtagnewsfeed.dto';

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

    async postnewsfeed(file,data: newsfeedCheckDto): Promise<void> {
        
        const content = data.content;
        const userId = 1; // 썬더 클라이언트로 보내는 임시 유저아이디
        const tag = data.tag;

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

        if (file.length !== 0) {
            const filenames = file.map(file => file.filename)
            const promises = filenames.map(filename => this.newsfeedImageRepository.save({
                image: filename,
                newsFeed: {id:newsfeedId.id}
            }))
            await Promise.all(promises)
        }
        
        
        return
        }

    async readnewsfeed(userId:number) {

        const newsfeeds = await this.newsfeedRepository.find({
            relations: ['newsFeedTags.tag','newsImages','user'],
            select: ['id','content','createdAt','updatedAt'],
            where:{'user' : {id:userId},'deletedAt': null}
            });

            const result = newsfeeds.map(feed => {
                const userName = feed.user.username;
                const userImage = feed.user.image;
                const userEmail = feed.user.email;
                const tagsName = feed.newsFeedTags.map(tag => tag.tag.tagName);
                const newsfeedImage = feed.newsImages.map(image => image.image);

                return {
                    id: feed.id,
                    content: feed.content,
                    createAt: feed.createdAt,
                    updateAt: feed.updatedAt,
                    userName: userName,
                    userEmail: userEmail,
                    userImage: userImage,
                    tagsName: tagsName,
                    newsfeedImage: newsfeedImage
                }
            })

        return result
    }

    async deletenewsfeed(id:number) {
        const userId = 1 // 썬더 클라이언트로 보내는 임시 유저 아이디
        const checknewsfeed = await this.newsfeedRepository.findOne({
            relations: ['user'],
            where: {id:id}
        })
        if(!checknewsfeed) {
            throw new ForbiddenException("이미 삭제되었거나 존재하지 않는 뉴스피드입니다. id:" + id)
        }
        try {
            const checkuserId = checknewsfeed.user["id"]

            if(userId !== checkuserId) {
                throw new ForbiddenException('권한이 존재하지 않습니다.');
            }

            await this.newsfeedRepository.softDelete(id);
  
        } catch (err){
            console.log("알수 없는 에러가 발생했습니다.", err);
            throw new Error(err)
        }
    }

    async modinewsfeed(file,id:number,data: modiNewsfeedCheckDto) : Promise<void>{
        const { content,tag } = data
        const userId = 1 // 썬더 클라이언트로 보내는 임시 유저 아이디
        
        const checknewsfeed = await this.newsfeedRepository.findOne({
            relations: ['user'],
            where: {id:id}
        })
        
        if(!checknewsfeed) {
            throw new ForbiddenException("이미 삭제되었거나 존재하지 않는 뉴스피드입니다. id:" + id)
        }
        const checkuserId = checknewsfeed.user["id"]

        if(userId !== checkuserId) {
            throw new ForbiddenException('권한이 존재하지 않습니다.');
        }
        
        try {

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

            if (file.length !== 0) {
                await this.newsfeedImageRepository.delete({
                    newsFeed: {id:id}
                })
                const filenames = file.map(file => file.filename)
                const promises = filenames.map(filename => this.newsfeedImageRepository.save({
                    image: filename,
                    newsFeed: {id:id}
                }))
                await Promise.all(promises)
            }

            return
        } catch (err){
            console.log("알수 없는 에러가 발생했습니다.", err);
            throw new Error(err)
        }
    }

    async serchtagnewsfeed(data:serchtagnewsfeedCheckDto){

        try {
            const tag = data.tag

            const serchtag = await this.tagRepository.find({
                where: { tagName: Like(`%${tag}%`) },
                select: ['id']
            })
    
            const wherenewsfeedid = serchtag.map((tag) => ({ tagId : tag.id }))
    
            const newsfeedTag = await this.newsfeedTagRepository.find({
                where: wherenewsfeedid,
                select: ['newsFeedId']
            })
            
            const newsfeedserchid = Array.from(new Set(newsfeedTag.map((tag) => tag.newsFeedId)))
    
            const numberingid = newsfeedserchid.map(id => ({id}))
    
            const findnewsfeed = await this.newsfeedRepository.find({
                relations: ['newsFeedTags.tag','newsImages','user'],
                where: numberingid
            })
                  
            const result = [];
            for (const id of newsfeedserchid) {
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
    
            return result
        } catch(err) {
            console.log("알수 없는 에러가 발생했습니다.", err);
            throw new Error(err)
        }
        
    }
}
