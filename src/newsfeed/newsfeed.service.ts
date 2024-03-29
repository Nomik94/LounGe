import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { NewsfeedRepository } from 'src/common/repository/newsfeed.repository';
import { NewsfeedTagRepository } from 'src/common/repository/newsfeed.tag.repository';
import { NewsfeedImageRepository } from 'src/common/repository/newsfeedImage.repository';
import { TagRepository } from 'src/common/repository/tag.repository';
import { UserGroupRepository } from 'src/common/repository/user.group.repository';
import { ISerchNewsfeedList } from './interface/serch.newsfeed.list.interface';
import { ISerchTagMyNewsfeed } from './interface/serch.tag.mynewsfeed.interface';
import { ISerchTagNewsfeed } from './interface/serch.tag.newsfeed.interface';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { IFirstNesfeed } from './interface/firstNewsfeed.interface';

@Injectable()
export class NewsfeedService {
  constructor(
    private readonly newsfeedRepository: NewsfeedRepository,
    private readonly tagRepository: TagRepository,
    private readonly newsfeedTagRepository: NewsfeedTagRepository,
    private readonly newsfeedImageRepository: NewsfeedImageRepository,
    private readonly userGroupRepository: UserGroupRepository,
    private readonly elasticSearchService: ElasticsearchService
  ) {}

  pageSize = 10;
  // 뉴스피드 작성
  async createNewsfeed(
    file,
    data,
    userId: number,
    groupId: number,
  ): Promise<void> {
    const content = data.content;
    const checkJoinGroup = await this.userGroupRepository.checkJoinGroup(
      userId,
      groupId,
    );
    if (!checkJoinGroup) {
      throw new ForbiddenException(
        '가입된 그룹이 아니거나 그룹이 존재하지 않습니다.',
      );
    }
    if (
      checkJoinGroup.role === '가입대기'
    ) {
      throw new ForbiddenException('그룹 가입 신청 중입니다.');
    }
    try {
      const newsfeedId = await this.newsfeedRepository.createNewsfeed(
        content,
        userId,
        groupId,
      );
      if (data.newsfeedTags) {
        const tag = data.newsfeedTags.split(',');
        for (const i of tag) {
          if (!(await this.tagRepository.serchTagOne(i))) {
            await this.tagRepository.createTag(i);
          }
        }
        const serchTag = [];
        for (const i of tag) {
          const a = await this.tagRepository.serchTagOneForNewsfeed(i);
          serchTag.push(a.id);
        }
        for (const i of serchTag) {
          await this.newsfeedTagRepository.createNewsfeed(i, newsfeedId.id);
        }
      }
      let fileNames = null;
      if (file.length !== 0) {
        fileNames = file.map((file) => file.key);
        const promises = fileNames.map((key) =>
          this.newsfeedImageRepository.createNewsfeedImage(key, newsfeedId.id),
        );
        await Promise.all(promises);
      }
      let tagsConfirm = null;
      if(data.newsfeedTags){
         tagsConfirm = data.newsfeedTags.split(',')
      }
      await this.elasticSearchService.index({
        index: 'newsfeeds',
        body: {
          id: newsfeedId.id,
          content : content,
          tagsName: tagsConfirm,
        }
      })
      return;
    } catch (err) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다. 관리자에게 문의해 주세요.',
      );
    }
  }

  // 뉴스피드 삭제
  async deleteNewsfeed(userId: number, id: number): Promise<void> {
    const checkNewsfeed = await this.newsfeedRepository.checkNewsfeed(id);
    if (checkNewsfeed === null) {
      throw new ForbiddenException(
        '이미 삭제되었거나 존재하지 않는 뉴스피드입니다. id:' + id,
      );
    }
    const checkUserId = checkNewsfeed.user['id'];
    if (userId !== checkUserId) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    }
    try {
      await this.newsfeedRepository.deleteNewsfeed(id);
      await this.newsfeedTagRepository.deleteNewsfeedTag(id);
      await this.newsfeedImageRepository.deleteNewsfeedImage(id);
      await this.elasticSearchService.deleteByQuery({
        index: 'newsfeeds',
          body : {
            query:{
              match :{
                id : id
              }
            }
          }
      })

    } catch (err) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다. 관리자에게 문의해 주세요.',
      );
    }
  }

  // 뉴스피드 수정
  async modifyNewsfeed(file, id: number, data, userId: number): Promise<void> {
    const { content } = data;
    const checkNewsfeed = await this.newsfeedRepository.checkNewsfeed(id);
    if (!checkNewsfeed) {
      throw new ForbiddenException(
        '이미 삭제되었거나 존재하지 않는 뉴스피드입니다. id:' + id,
      );
    }
    const checkUserId = checkNewsfeed.user['id'];
    if (userId !== checkUserId) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    }
    try {
      await this.newsfeedRepository.modifyNewsfeedContent(id, content);
      if (data.newsfeedTags) {
        const tag = data.newsfeedTags.split(',');
        await this.newsfeedTagRepository.deleteNewsfeedTag(id);
        for (const i of tag) {
          if (!(await this.tagRepository.serchTagOne(i))) {
            await this.tagRepository.createTag(i);
          }
        }
        const serchTag = [];
        for (const i of tag) {
          const a = await this.tagRepository.serchTagOneForNewsfeed(i);
          serchTag.push(a.id);
        }
        for (const i of serchTag) {
          await this.newsfeedTagRepository.modifyNewsfeed(i, id);
        }
      }
      if (file.length !== 0) {
        await this.newsfeedImageRepository.deleteNewsfeedImage(id);
        const fileNames = file.map((file) => file.key);
        const promises = fileNames.map((key) =>
          this.newsfeedImageRepository.modifyNewsfeedImage(key, id),
        );
        await Promise.all(promises);
      }

      const newsfeedIdByEs = await this.elasticSearchService.search({
        index: 'newsfeeds',
        query: {
          match: {
            id :id
          }
        }
      })
      if(!data.newsfeedTags) {
        await this.elasticSearchService.update({
              index: 'newsfeeds',
              id: newsfeedIdByEs.hits.hits[0]._id, 
              body: {
                doc: {
                  content: content
                }
              }
            })
          } else {
            await this.elasticSearchService.update({
              index: 'newsfeeds',
              id: newsfeedIdByEs.hits.hits[0]._id, 
              body: {
                doc: {
                  content: content,
                  tagsName: data.newsfeedTags.split(',')
                }
              }
            })
          }
    } catch (err) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다. 관리자에게 문의해 주세요.',
      );
    }
  }

  // 태그 검색 (소속 그룹 뉴스피드)
  async serchTagNewsfeed(userId, NewsfeedIds): Promise<ISerchTagNewsfeed[]> {
    try {
      const findGroup = await this.userGroupRepository.checkUserStatus(userId);
      const groupIds = findGroup.map((group) => group.groupId);
      const findNewsfeed = await this.newsfeedRepository.findNewsfeedByGroupId(
        NewsfeedIds,
        groupIds,
      );
      return this.returnNewsfeedList(userId,findNewsfeed)
    } catch (err) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다. 관리자에게 문의해 주세요.',
      );
    }
  }

  // 태그 검색 (특정 그룹 뉴스피드)
  async serchTagNewsfeedGroup(groupId, userId, NewsfeedIds): Promise<ISerchTagNewsfeed[]> {
    try {
      const findNewsfeed =
        await this.newsfeedRepository.findNewsfeedByOneGroupId(
          NewsfeedIds,
          groupId,
        );
        return this.returnNewsfeedList(userId,findNewsfeed)
    } catch (err) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다. 관리자에게 문의해 주세요.',
      );
    }
  }

  // 태그 검색 (내 뉴스피드)
  async serchTagMyNewsfeed(userId,NewsfeedIds): Promise<ISerchTagMyNewsfeed[]> {
    try {
      const findGroup = await this.userGroupRepository.checkUserStatus(userId);
      const groupIds = findGroup.map((group) => group.groupId);
      const findNewsfeed = await this.newsfeedRepository.findNewsfeedByTag(
        NewsfeedIds,
        userId,
        groupIds,
      );
      return this.returnNewsfeedList(userId,findNewsfeed)
    } catch (err) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다. 관리자에게 문의해 주세요.',
      );
    }
  }

  // 뉴스피드 읽기 (특정 그룹)
  async readNewsfeedGroup(
    groupId: number,
    page: number,
    userId: number
  ) : Promise<ISerchNewsfeedList[] | IFirstNesfeed>{
    try {
      const findNewsfeed =
        await this.newsfeedRepository.findnewsfeedByNewsfeedId(
          groupId,
          page,
          this.pageSize,
        );
      return this.returnNewsfeedList(userId,findNewsfeed)
    } catch (err) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다. 관리자에게 문의해 주세요.',
      );
    }
  }

  // 뉴스피드 읽기 (내 뉴스피드)
  async readNewsfeedMyList(
    userId: number,
    page: number,
  ): Promise<ISerchNewsfeedList[] | IFirstNesfeed> {
    try {
      const findGroup = await this.userGroupRepository.checkUserStatus(userId);
      const groupIds = findGroup.map((group) => group.groupId);
      if(!groupIds.length) {
        return this.firstNewsfeed()
      }
      const findNewsfeed = await this.newsfeedRepository.findnewsfeedByUserId(
        userId,
        groupIds,
        page,
        this.pageSize,
      );
        return this.returnNewsfeedList(userId,findNewsfeed)
    } catch (err) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다. 관리자에게 문의해 주세요.',
      );
    }
  }

  // 뉴스피드 읽기 (소속 그룹 뉴스피드)
  async readNewsfeedMyGroup(
    userId: number,
    page: number,
  ): Promise<ISerchNewsfeedList[] | IFirstNesfeed> {
    try {
      const findGroup = await this.userGroupRepository.checkUserStatus(userId);
      const groupIds = findGroup.map((group) => group.groupId);
      if(!groupIds.length) {
        return this.firstNewsfeed()
      }
      const findNewsfeed = await this.newsfeedRepository.findnewsfeedByGroupId(
        groupIds,
        page,
        this.pageSize,
      );
      return this.returnNewsfeedList(userId,findNewsfeed)
    } catch (err) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다. 관리자에게 문의해 주세요.',
      );
    }
  }

  // 서치바에서 뉴스피드 태그 검색
  async serchBarTagNewsfeed(
    userId: number,
    NewsfeedIds: number[]
  ): Promise<ISerchNewsfeedList[]> {
    try {
      const findGroup = await this.userGroupRepository.checkUserStatus(userId);
      const groupIds = findGroup.map((group) => group.groupId);
      const findNewsfeed = await this.newsfeedRepository.findNewsfeedByGroupId(
        NewsfeedIds,
        groupIds,
      );
      return this.returnNewsfeedList(userId,findNewsfeed)
    } catch (err) {
      throw new InternalServerErrorException(
        '찾으시는 태그가 없습니다.',
      );
    }
  }

  // 수정 시 컨텐츠 내용 가져오기
  async getNewsfeedContent(id){
    try{
      const content = await this.newsfeedRepository.findOne({
        where: {id: id}
      })
      return content
    } catch(err) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다. 관리자에게 문의해 주세요.',
      );
    }
  }

  // 엘라스틱 서치 헤더바 사용 (뉴스피드,태그 검색)
  async testSearchIndex(data) {
    const result = await this.elasticSearchService.search({
      index: 'newsfeeds',
      body: {
        size: 500
      },
      query : {
        query_string: {
          query: `*${data}*`,
          fields: ['content', 'tagsName']
        }
      }
    })
    const resultArray = result.hits.hits.map(item => item._source)   
    const resultByEs = Array.from(
      new Set(resultArray.map((item) => item['id']))
    )
    if (!resultByEs[0]){
          throw new InternalServerErrorException(
          '찾으시는 뉴스피드 또는 태그가 없습니다.',
        );
    }
    return resultByEs
  }

  // 태그 클릭 시 엘라스틱 서치 이용
  async elasticTagIndex(data) {
    const result = await this.elasticSearchService.search({
      index: 'newsfeeds',
      body: {
        size: 500
      },
      query : {
        query_string: {
          query: `*${data}*`,
          fields: ['tagsName']
        }
      }
    })
    const resultArray = result.hits.hits.map(item => item._source)   
    const resultByEs = Array.from(
      new Set(resultArray.map((item) => item['id']))
    )
    return resultByEs
  }

  firstNewsfeed() {
    return {
      userIdentify: 2,
    }
  }

  // 리턴 리스트 모듈
  returnNewsfeedList(userId,findNewsfeed) {
    const result = findNewsfeed.map((feed) => {
      const userName = feed.user.username;
      const userImage = feed.user.image;
      const userEmail = feed.user.email;
      const tagsName = feed.newsFeedTags.map((tag) => tag.tag.tagName);
      const newsfeedImage = feed.newsImages.map((image) => image.image);
      const groupId = feed.group.id;
      const groupName = feed.group.groupName;
      const checkUserId = feed.user.id;
      let userIdentify = 0;
      if (userId == checkUserId) {
        userIdentify = 1;
      }
      const comment = feed.comment.map((comment) => comment.content);
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
        userIdentify: userIdentify,
        comment: comment,
      };
    });
    return result;
  }
}
