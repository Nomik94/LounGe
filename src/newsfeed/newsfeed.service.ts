import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupNewsfeedRepository } from 'src/common/repository/group.newsfeed.repository';
import { GroupRepository } from 'src/common/repository/group.repository';
import { NewsfeedRepository } from 'src/common/repository/newsfeed.repository';
import { NewsfeedTagRepository } from 'src/common/repository/newsfeed.tag.repository';
import { NewsfeedImageRepository } from 'src/common/repository/newsfeedImage.repository';
import { TagRepository } from 'src/common/repository/tag.repository';
import { UserGroupRepository } from 'src/common/repository/user.group.repository';
import { UserRepository } from 'src/common/repository/user.repository';
import { GroupNewsFeed } from 'src/database/entities/group-newsfeed.entity';
import { Group } from 'src/database/entities/group.entity';
import { NewsFeedTag } from 'src/database/entities/newsFeed-Tag.entity';
import { NewsFeed } from 'src/database/entities/newsFeed.entity';
import { NewsFeedImage } from 'src/database/entities/newsFeedImage.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { UserGroup } from 'src/database/entities/user-group.entity';
import { User } from 'src/database/entities/user.entity';
import { In, Like, Repository } from 'typeorm';

@Injectable()
export class NewsfeedService {
    constructor(
        private readonly newsfeedRepository: NewsfeedRepository,
        private readonly tagRepository: TagRepository,
        private readonly newsfeedTagRepository: NewsfeedTagRepository,
        private readonly newsfeedImageRepository: NewsfeedImageRepository,
        private readonly userRepository: UserRepository,
        private readonly groupNewsfeedRepository: GroupNewsfeedRepository,
        private readonly userGroupRepository: UserGroupRepository,
        private readonly groupRepository: GroupRepository,
    ) {}

    // 뉴스피드 작성
    async createNewsfeed(file,data,userId:number,groupId:number): Promise<void> {
        const content = data.content;
        const checkJoinGroup = await this.userGroupRepository.checkJoinGroup(userId,groupId)
        if(checkJoinGroup.length === 0){
            throw new ForbiddenException('가입된 그룹이 아니거나 그룹이 존재하지 않습니다.');
        }
        if(checkJoinGroup[0].role !== "그룹장" && checkJoinGroup[0].role !== "회원") {
            throw new ForbiddenException('그룹 가입 신청 중입니다.');
        }
        const newsfeedId = await this.newsfeedRepository.createNewsfeed(content,userId)
        if (data.newsfeedTags){
            const tag = data.newsfeedTags.split(',')
            for(const i of tag) {
                if (!await this.tagRepository.serchTagOne(i)) {
                    await this.tagRepository.createTag(i)
                }
            }
            const serchTag = [];
            for (const i of tag) {
                const a = await this.tagRepository.serchTagOneForNewsfeed(i)
                serchTag.push(a.id);
            }
            for (const i of serchTag) {
                await this.newsfeedTagRepository.createNewsfeed(i,newsfeedId)
            }
        }
        if (file.length !== 0) {
            const fileNames = file.map(file => file.filename)
            const promises = fileNames.map(filename => this.newsfeedImageRepository.createNewsfeedImage(filename,newsfeedId))
            await Promise.all(promises)
        }
        await this.groupNewsfeedRepository.createNewsfeed(newsfeedId,groupId)
        return
        }

    // 뉴스피드 삭제
    async deleteNewsfeed(userId:number,id:number): Promise<void> {
        const checkNewsfeed = await this.newsfeedRepository.checkNewsfeed(id)
        if(checkNewsfeed === null) {
            throw new ForbiddenException("이미 삭제되었거나 존재하지 않는 뉴스피드입니다. id:" + id)
        }
        const checkUserId = checkNewsfeed.user["id"]
        if(userId !== checkUserId) {
            throw new ForbiddenException('권한이 존재하지 않습니다.');
        }
        try {
            await this.newsfeedRepository.deleteNewsfeed(id);
            await this.groupNewsfeedRepository.deleteNewsfeedGroup(id)
            await this.newsfeedTagRepository.deleteNewsfeedTag(id)
            await this.newsfeedImageRepository.deleteNewsfeedImage(id)
        } catch (err){
            throw new Error(err)
        }
    }

    // 뉴스피드 수정
    async modifyNewsfeed(file,id:number,data,userId:number) : Promise<void>{
        const { content } = data
        const checkNewsfeed = await this.newsfeedRepository.checkNewsfeed(id)
        if(!checkNewsfeed) {
            throw new ForbiddenException("이미 삭제되었거나 존재하지 않는 뉴스피드입니다. id:" + id)
        }
        const checkUserId = checkNewsfeed.user["id"]
        if(userId !== checkUserId) {
            throw new ForbiddenException('권한이 존재하지 않습니다.');
        }
        try {
            await this.newsfeedRepository.modifyNewsfeedContent(id,content);
            if (data.newsfeedTags) {
                const tag = data.newsfeedTags.split(',')
                await this.newsfeedTagRepository.deleteNewsfeedTag(id)
                for(const i of tag) {
                    if (!await this.tagRepository.serchTagOne(i)) {
                        await this.tagRepository.createTag(i)
                    }
                }
                const serchTag = [];
                for (const i of tag) {
                    const a = await this.tagRepository.serchTagOneForNewsfeed(i)
                    serchTag.push(a.id);
                }
                for (const i of serchTag) {
                    await this.newsfeedTagRepository.modifyNewsfeed(i,id)
                }
            }
            if (file.length !== 0) {
                await this.newsfeedImageRepository.deleteNewsfeedImage(id)
                const fileNames = file.map(file => file.filename)
                const promises = fileNames.map(filename => this.newsfeedImageRepository.modifyNewsfeedImage(filename,id))
                await Promise.all(promises)
            }
            return
        } catch (err){
            throw new Error(err)
        }
    }

    // 태그 검색 (소속 그룹 뉴스피드)
    async serchTagNewsfeed(data):Promise<Array<any>>{
        try {
            const tag = data
            const serchTag = await this.tagRepository.serchTagWord(tag)
            const whereNewsfeedId = serchTag.map((tag) => ({ tagId : tag.id }))
            const newsfeedTag = await this.newsfeedTagRepository.serchTagArray(whereNewsfeedId)
            const newsfeedSerchId = Array.from(new Set(newsfeedTag.map((tag) => tag.newsFeedId)))
            const numberingId = newsfeedSerchId.map(id => ({id}))
            const findNewsfeed = await this.newsfeedRepository.findNewsfeedByTag(numberingId)
            const result = [];
            for (const id of newsfeedSerchId) {
                const feed = findNewsfeed.find(item => item.id ===id);
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
            throw new Error(err)
        }
    }

    // 태그 검색 (특정 그룹 뉴스피드)
    async serchTagNewsfeedGroup(data,groupId){
        try {
            const {tag} = data
            const serchTag = await this.tagRepository.serchTagWord(tag)
            const whereNewsfeedId = serchTag.map((tag) => ({ tagId : tag.id }))        
            const newsfeedTag = await this.newsfeedTagRepository.serchTagArray(whereNewsfeedId)
            const serchNewsfeedId = Array.from(new Set(newsfeedTag.map((tag) => tag.newsFeedId)))
            const numberingId = serchNewsfeedId.map(id => ({id}))
            const findNewsfeed = await this.newsfeedRepository.findNewsfeedByTag(numberingId)
            const result = [];
            for (const id of serchNewsfeedId) {
                const feed = findNewsfeed.find(item => item.id ===id);
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
            throw new Error(err)
        }
    }

    // 태그 검색 (내 뉴스피드)
    async serchTagMyNewsfeed(data,userId) {
        try {
            const tag = data
            const serchTag = await this.tagRepository.serchTagWord(tag)
            const whereNewsfeedId = serchTag.map((tag) => ({ tagId : tag.id }))
            const newsfeedTag = await this.newsfeedTagRepository.serchTagArray(whereNewsfeedId)
            const serchNewsfeedId = Array.from(new Set(newsfeedTag.map((tag) => tag.newsFeedId)))
            const numberingId = serchNewsfeedId.map(id => ({id}))
            const findNewsfeed = await this.newsfeedRepository.findNewsfeedByTag(numberingId)
            const result = [];
            for (const id of serchNewsfeedId) {
                const feed = findNewsfeed.find(item => item.id ===id);
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
            throw new Error(err)
        }
    }

    // 뉴스피드 읽기 (특정 그룹)
    async readNewsfeedGroup(groupId:number) {
        try {
            const newsfeed = await this.groupNewsfeedRepository.serchNewsfeedIdByGroupId(groupId)
            const newsfeedIds = newsfeed.map(Newsfeed => Newsfeed.newsFeedId)
            const findNewsfeed = await this.newsfeedRepository.findnewsfeedByNewsfeedId(newsfeedIds)
            const result = findNewsfeed.map(feed => {
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
                    newsfeedImage: newsfeedImage,
                    groupId: feed.groupNewsFeeds.map(group => group.group.id),
                    groupName: feed.groupNewsFeeds.map(group => group.group.groupName)
                }
            })
        return result
        } catch(err){
            throw new Error(err)
        }
    }

    // 뉴스피드 읽기 (내 뉴스피드)
    async readNewsfeedMyList(userId:number) {
        try {
            const findNewsfeed = await this.newsfeedRepository.findnewsfeedByUserId(userId)
                const result = findNewsfeed.map(feed => {
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
        } catch(err) {
            throw new Error(err)
        }
    }

    // 뉴스피드 읽기 (소속 그룹 뉴스피드)
    async readNewsfeedMyGroup(userId:number){
        try {
            const findGroup = await this.userGroupRepository.checkUserStatus(userId)
            const groupIds = findGroup.map(group => group.groupId);
            const findNewsfeed = await this.groupNewsfeedRepository.serchNewsfeedIdByGroupIdArray(groupIds)
            const newsfeedIds = findNewsfeed.map(item => item.newsFeedId)
            const findNewsfeedId = await this.newsfeedRepository.findnewsfeedByNewsfeedId(newsfeedIds)
              const result = findNewsfeedId.map(feed => {
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
        } catch (err){
            throw new Error(err)
        }
    }
}

