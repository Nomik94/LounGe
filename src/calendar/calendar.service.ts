import _ from 'lodash';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEvent } from 'src/database/entities/userEvent.entity';
import { Between, Not, Repository } from 'typeorm';
import { GroupEvent } from 'src/database/entities/groupEvent.entity';
import { UserEventDto } from './dto/user.event.dto';
import { GroupEventDto } from './dto/group.event.dto';
import { Group } from 'src/database/entities/group.entity';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { IGroupEventList } from './interface/group.event.list.interface';
import { Cache } from 'cache-manager';
import { UserGroupRepository } from 'src/common/repository/user.group.repository';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(UserEvent)
    private readonly userEventRepository: Repository<UserEvent>,
    @InjectRepository(GroupEvent)
    private readonly groupEventRepository: Repository<GroupEvent>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly userGroupRepository: UserGroupRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // 전체 이벤트 리스트
  async getAllEvent(userId: number, startStr, endStr) {
    const myGroupList = await this.userGroupRepository.getMyGroupsWithTime(
      userId,
      startStr,
      endStr,
    );

    const lankerGroups = await this.getLankerGroups();
    const mapLankerGroups = lankerGroups.map((userGroup) => userGroup.groupId);
    const mapMyGroupIds = myGroupList.map((userGroup) => userGroup.groupId);
    const differenceGroups = mapMyGroupIds.filter(
      (id) => !mapLankerGroups.includes(id),
    );
    const intersectionGroups = mapMyGroupIds.filter((id) =>
      mapLankerGroups.includes(id),
    );

    let nullCacheGroups = [];
    let cacheData = [];

    for (let id of intersectionGroups) {
      const checkCache = await this.cacheManager.get(`${id}${startStr}`);
      if (checkCache) {
        cacheData.push(checkCache);
      } else {
        nullCacheGroups.push(id);
      }
    }

    let joinCacheData = [];
    cacheData.forEach((array) => {
      joinCacheData = joinCacheData.concat(array);
    });

    const joinGroupIds = differenceGroups.concat(nullCacheGroups);
    const myGroupIds = joinGroupIds.map((id) => ({
      group: { id },
    }));

    let groupEvents = [];
    let mapGroupEvents = [];
    if (myGroupIds.length > 0) {
      groupEvents = await this.groupEventRepository.find({
        where: myGroupIds,
        relations: ['group'],
      });

      mapGroupEvents = groupEvents.map((event) => ({
        id: event.id,
        where: 'group',
        name: event.group.groupName,
        tableId: event.group.id,
        eventName: event.eventName,
        eventContent: event.eventContent,
        start: event.start,
        end: event.end,
        lat: event.lat,
        lng: event.lng,
        location: event.location,
        color: '#FFC8A2',
        backgroundImage: event.group.backgroundImage,
      }));
    }
    if (nullCacheGroups.length !== 0) {
      const saveCacheDataList = mapGroupEvents.filter((event) =>
        nullCacheGroups.includes(event.tableId),
      );
      let dataId;
      let dataArray = [];
      let first = true
      for (let data of saveCacheDataList) {
        if(first) {
          dataId = data.tableId
          first =false
        }
        if(dataId === data.tableId){
          dataArray = []
        }
        await dataArray.push(data)
        await this.cacheManager.set(`${data.tableId}${startStr}`, dataArray, {
          ttl: 300,
        });
      }
    }
    const concatGroupEvents = mapGroupEvents.concat(joinCacheData);

    const myUserEvents = await this.userEventRepository.find({
      where: { user: { id: userId }, start: Between(startStr, endStr) },
      relations: ['user'],
    });

    const mapUserEvents = myUserEvents.map((event) => ({
      id: event.id,
      where: 'user',
      name: '개인',
      tableId: event.user.id,
      eventName: event.eventName,
      eventContent: event.eventContent,
      start: event.start,
      end: event.end,
      lat: event.lat,
      lng: event.lng,
      location: event.location,
      color: '#D4F0F0',
      backgroundImage: '1.png',
    }));

    const joinEvents = mapUserEvents.concat(concatGroupEvents);
    joinEvents.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );

    return joinEvents;
  }

  // 유저 이벤트 생성
  async createUserEvent(userId: number, data: UserEventDto): Promise<void> {
    await this.userEventRepository.insert({
      eventName: data.eventName,
      eventContent: data.eventContent,
      start: data.start,
      end: data.end,
      lat: data.lat,
      lng: data.lng,
      location: data.location,
      user: { id: userId },
    });
  }

  // 그룹 이벤트 생성
  async createGroupEvent(
    userId: number,
    groupId: number,
    data: GroupEventDto,
  ): Promise<void> {
    const checkLeader = await this.groupRepository.findOneBy({
      user: { id: userId },
      id: groupId,
    });
    if (!checkLeader) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    }
    await this.groupEventRepository.insert({
      eventName: data.eventName,
      eventContent: data.eventContent,
      start: data.start,
      end: data.end,
      lat: data.lat,
      lng: data.lng,
      location: data.location,
      group: { id: groupId },
    });
  }

  // 그룹 이벤트 리스트
  async getGroupEvent(
    userId: number,
    groupId: number,
  ): Promise<IGroupEventList> {
    await this.checkMember(userId, groupId);

    const checkRole = await this.groupRepository.findOne({
      where: { id: groupId, user: { id: userId } },
    });
    let role = false;

    if (checkRole) {
      role = true;
    }

    const groupInfo = await this.groupEventRepository.findBy({
      group: { id: groupId },
    });
    return { groupInfo, role };
  }

  // 그룹 이벤트 상세 보기 API
  async getGroupEventDetail(
    userId: number,
    groupId: number,
    eventId: number,
  ): Promise<GroupEvent> {
    await this.checkMember(userId, groupId);
    return await this.groupEventRepository.findOne({
      where: { id: eventId },
      relations: ['group'],
    });
  }

  // 유저 이벤트 상세 보기
  async getUserEventDetail(
    userId: number,
    currId: number,
    eventId: number,
  ): Promise<UserEvent> {
    if (currId !== userId) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    }
    return await this.userEventRepository.findOneBy({ id: eventId });
  }

  // 유저 이벤트 삭제
  async deleteUserEvent(userId: number, eventId: number): Promise<void> {
    await this.checkUser(userId, eventId);
    await this.userEventRepository.softDelete(eventId);
  }

  // 그룹 이벤트 삭제
  async deleteGroupEvent(userId: number, eventId: number): Promise<void> {
    const checkGroupLeader = await this.groupEventRepository.findOne({
      where: { group: { user: { id: userId } }, id: eventId },
    });
    if (!checkGroupLeader) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    }
    await this.groupEventRepository.softDelete(eventId);
  }

  // 유저 체크
  async checkUser(userId: number, eventId: number): Promise<void> {
    const userEvent = await this.userEventRepository.findOne({
      where: { id: eventId, user: { id: userId } },
    });
    if (!userEvent) {
      throw new ForbiddenException(`권한이 존재하지 않습니다.`);
    }
  }

  // 멤버 체크
  async checkMember(userId: number, groupId: number): Promise<void> {
    const memberCheck = await this.userGroupRepository.findOneBy({
      userId,
      groupId,
      role: Not('가입대기'),
    });
    if (!memberCheck) {
      throw new ForbiddenException('그룹에 가입해야만 확인할 수 있습니다.');
    }
  }

  async getLankerGroups() {
    return await this.userGroupRepository.getLankerGroups();
  }
}
