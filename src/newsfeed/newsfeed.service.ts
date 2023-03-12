import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupNewsFeed } from 'src/database/entities/group-newsfeed.entity';
import { Group } from 'src/database/entities/group.entity';
import { NewsFeedTag } from 'src/database/entities/newsFeed-Tag.entity';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { NewsFeedImage } from 'src/database/entities/newsFeedImage.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { User } from 'src/database/entities/user.entity';
// import { EntityRepository, Repository } from 'typeorm';
import { In, Like, Not, Repository } from 'typeorm';
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

        @InjectRepository(GroupNewsFeed)
        private readonly groupNewsfeedRepository: Repository<GroupNewsFeed>,

        @InjectRepository(UserGroup)
        private readonly userGroupRepository: Repository<UserGroup>,

        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
    ) {}

    async postnewsfeed(file,data,userId:number,groupId:number): Promise<void> {

        const content = data.content;
        const tag = data.newsfeedTags.split(',')

        const checkJoinGroup = await this.userGroupRepository.find({
            where: {userId: userId, groupId:groupId}
        })
        
        if(checkJoinGroup.length === 0){
            throw new ForbiddenException('가입된 그룹이 아니거나 그룹이 존재하지 않습니다.');
        }
        if(checkJoinGroup[0].role !== "그룹장" && checkJoinGroup[0].role !== "회원") {
            throw new ForbiddenException('그룹 가입 신청 중입니다.');
        }

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

        await this.groupNewsfeedRepository.insert({
            newsFeedId: newsfeedId.id,
            groupId: groupId
        })
        
        return
        }

    async deletenewsfeed(userId:number,id:number) {

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
            await this.newsfeedRepository.softDelete(id);
            await this.groupNewsfeedRepository.delete({
                newsFeedId:id
            })
            await this.newsfeedTagRepository.delete({
                newsFeedId:id
            })
            await this.newsfeedImageRepository.delete({
                newsFeed: {id:id}
            })
        } catch (err){
            console.log("알수 없는 에러가 발생했습니다.", err);
            throw new Error(err)
        }
    }

    async modinewsfeed(file,id:number,data: modiNewsfeedCheckDto,userId:number) : Promise<void>{
        const { content,tag } = data

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

    async serchtagnewsfeed(data){

        try {
            const tag = data

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
                relations: ['newsFeedTags.tag','newsImages','user','groupNewsFeeds.group'],
                where: numberingid
            })
            
            const result = [];
            for (const id of newsfeedserchid) {
                const feed = findnewsfeed.find(item => item.id ===id);
                if (feed) {
                    const obj = {
                        id: feed.id,
                        content: feed.content,
                        createAt: feed.createdAt,
                        updateAt: feed.updatedAt,
                        userName: feed.user.username,
                        userImage: feed.user.image,
                        userEmail: feed.user.email,
                        tagsName: feed.newsFeedTags.map(tag => tag.tag.tagName),
                        newsfeedImage : feed.newsImages.map(image => image.image),
                        groupId: feed.groupNewsFeeds.map(group => group.group.id),
                        groupName: feed.groupNewsFeeds.map(group => group.group.groupName)
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

    async serchtagnewsfeedgroup(data,groupId){
        try {
            const {tag} = data
            

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
                relations: ['newsFeedTags.tag','newsImages','user','groupNewsFeeds.group'],
                where: numberingid
            })
            
            const result = [];
            for (const id of newsfeedserchid) {
                const feed = findnewsfeed.find(item => item.id ===id);
                if (feed) {
                    const obj = {
                        id: feed.id,
                        content: feed.content,
                        createAt: feed.createdAt,
                        updateAt: feed.updatedAt,
                        userName: feed.user.username,
                        userImage: feed.user.image,
                        userEmail: feed.user.email,
                        tagsName: feed.newsFeedTags.map(tag => tag.tag.tagName),
                        newsfeedImage : feed.newsImages.map(image => image.image),
                        groupId: feed.groupNewsFeeds.map(group => group.group.id),
                        groupName: feed.groupNewsFeeds.map(group => group.group.groupName)
                    }
                    result.push(obj)
                }
            }
            const filteredResult = result.filter(obj => obj.groupId.includes(groupId));
    
            return filteredResult

        } catch(err){
            console.log("알 수 없는 에러가 발생했습니다.", err);
            throw new Error(err)
        }
    }

    async serchtagmynewsfeed(data,userId) {
        
        try {
            const tag = data
            
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
                relations: ['newsFeedTags.tag','newsImages','user','groupNewsFeeds.group'],
                where: numberingid
            })
            
            const result = [];
            for (const id of newsfeedserchid) {
                const feed = findnewsfeed.find(item => item.id ===id);
                if (feed) {
                    const obj = {
                        id: feed.id,
                        content: feed.content,
                        createAt: feed.createdAt,
                        updateAt: feed.updatedAt,
                        userId: feed.user.id,
                        userName: feed.user.username,
                        userImage: feed.user.image,
                        userEmail: feed.user.email,
                        tagsName: feed.newsFeedTags.map(tag => tag.tag.tagName),
                        newsfeedImage : feed.newsImages.map(image => image.image),
                        groupId: feed.groupNewsFeeds.map(group => group.group.id),
                        groupName: feed.groupNewsFeeds.map(group => group.group.groupName)
                    }
                    result.push(obj)
                }
            }
            const filteredResult = result.filter(obj => obj.userId === userId);

            return filteredResult

        } catch(err){
            console.log("알 수 없는 에러가 발생했습니다.", err);
            throw new Error(err)
        }

    }

    async readnewsfeedgroup(groupId:number) {

        const newsfeed = await this.groupNewsfeedRepository.find({
            where: {'groupId' :groupId},
            select: ['newsFeedId']
        })

        const newsfeedIds = newsfeed.map(Newsfeed => Newsfeed.newsFeedId)
        
        const newsfeeds = await this.newsfeedRepository.find({
            relations: ['newsFeedTags.tag', 'newsImages', 'user'],
            select: ['id', 'content', 'createdAt', 'updatedAt'],
            where: { id: In(newsfeedIds), deletedAt: null }
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

    async readnewsfeedmy(userId:number) {

        const newsfeeds = await this.newsfeedRepository.find({
            relations: ['newsFeedTags.tag','newsImages','user','groupNewsFeeds','groupNewsFeeds.group'],
            select: ['id','content','createdAt','updatedAt'],
            where:{'user' : {id:userId},'deletedAt': null}
            });

            const result = newsfeeds.map(feed => {
                const userName = feed.user.username;
                const userImage = feed.user.image;
                const userEmail = feed.user.email;
                const tagsName = feed.newsFeedTags.map(tag => tag.tag.tagName);
                const newsfeedImage = feed.newsImages.map(image => image.image);
                const groupName = feed.groupNewsFeeds.map(group => group.group.groupName)
                const groupId = feed.groupNewsFeeds.map(group => group.groupId)

                return {
                    id: feed.id,
                    content: feed.content,
                    createAt: feed.createdAt,
                    updateAt: feed.updatedAt,
                    userName: userName,
                    userEmail: userEmail,
                    userImage: userImage,
                    tagsName: tagsName,
                    newsfeedImage: newsfeedImage,
                    groupName: groupName,
                    groupId: groupId
                }
            })

        return result
    }

    async readnewsfeedmygroup(userId:number){
        const mygroup = await this.userGroupRepository.find({
            where: [{userId:userId, role:'그룹장'}, {userId:userId, role:'회원'}]
        });
    
        const groupIds = mygroup.map(group => group.groupId);
    
        const newsfeed = await this.groupNewsfeedRepository.find({
            where: { groupId: In(groupIds) },
            select: ['newsFeedId']
        });

        const newsfeedIds = newsfeed.map(item => item.newsFeedId)
    
        const newsfeeds = await this.newsfeedRepository.find({
            relations: ['newsFeedTags.tag', 'newsImages', 'user','groupNewsFeeds','groupNewsFeeds.group'],
            select: ['id', 'content', 'createdAt', 'updatedAt'],
            where: { id: In(newsfeedIds), deletedAt: null }
          });
  
          const result = newsfeeds.map(feed => {
            const userName = feed.user.username;
            const userImage = feed.user.image;
            const userEmail = feed.user.email;
            const tagsName = feed.newsFeedTags.map(tag => tag.tag.tagName);
            const newsfeedImage = feed.newsImages.map(image => image.image);
            const groupId = feed.groupNewsFeeds.map(group => group.groupId)
            const groupName = feed.groupNewsFeeds.map(group => group.group.groupName)
            const groupImage = feed.groupNewsFeeds.map(group => group.group.groupImage)
            

            return {
                id: feed.id,
                content: feed.content,
                createAt: feed.createdAt,
                updateAt: feed.updatedAt,
                userName: userName,
                userEmail: userEmail,
                userImage: userImage,
                tagsName: tagsName,
                newsfeedImage: newsfeedImage,
                groupId: groupId,
                groupName: groupName,
                groupImage:groupImage
            }
        })

    return result
          
        
    }
}

