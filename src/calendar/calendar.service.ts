import _ from 'lodash';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEvent } from 'src/database/entities/userEvent.entity';
import { Not, Repository } from 'typeorm';
import { GroupEvent } from 'src/database/entities/groupEvent.entity';
import { UserEventDto } from './dto/userEvent.dto';
import { UpdateUserEventDto } from './dto/updateUserEvent.dto';
import { GroupEventDto } from './dto/groupEvent.dto';
import { UpdateGroupEventDto } from './dto/updategroupEvent.dto';
import { Group } from 'src/database/entities/group.entity';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { UserGroup } from 'src/database/entities/user-group.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(UserEvent)
    private readonly userEventRepository: Repository<UserEvent>,
    @InjectRepository(GroupEvent)
    private readonly groupEventRepository: Repository<GroupEvent>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
  ) {}

  // 전체 이벤트 리스트 API
  async getAllEvent(userId) {
    const myGroupList = await this.userGroupRepository.find({
      where: { userId, role: Not('가입대기') },
      select: ['groupId', 'userId'],
    });
    const myGroupIds = myGroupList.map((ids) => ({
      group: { id: ids.groupId },
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

    const myUserEvents = await this.userEventRepository.find({
      where: { user: { id: userId } },
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

    const joinEvents = mapGroupEvents.concat(mapUserEvents);
    await joinEvents.sort((a, b) => a.start - b.start);
    return joinEvents;
  }

  // 유저 이벤트 생성 API
  async createUserEvent(userId: number, data: UserEventDto) {
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

  // 그룹 이벤트 생성 API
  async createGroupEvent(userId: number, groupId: number, data: GroupEventDto) {
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

  // 그룹 이벤트 리스트 API
  async getGroupEvent(userId, groupId) {
    await this.memberCheck(userId, groupId);
    return await this.groupEventRepository.findBy({ group: { id: groupId } });
  }

  // 그룹 이벤트 상세 보기 API
  async getGroupEventDetail(userId, groupId, eventId) {
    await this.memberCheck(userId, groupId);
    return await this.groupEventRepository.findOne({
      where: { id: eventId },
      relations: ['group'],
    });
  }

  // 유저 이벤트 상세 보기 API
  async getUserEventDetail(userId, currId, eventId) {
    if (!currId === userId) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    }
    return await this.userEventRepository.findOneBy({ id: eventId });
  }

  // 유저 이벤트 삭제 API
  async deleteUserEvent(userId: number, eventId: number) {
    await this.checkUser(userId, eventId);
    await this.userEventRepository.softDelete(eventId);
  }

  // 그룹 이벤트 삭제 API
  async deleteGroupEvent(userId: number, eventId: number) {
    const checkGroupLeader = await this.groupEventRepository.findOne({
      where: { group: { user: { id: userId } } ,id : eventId},
    });
    if(!checkGroupLeader) {
      throw new ForbiddenException('권한이 존재하지 않습니다.')
    }
    await this.groupEventRepository.softDelete(eventId);
  }

  // async updateUserEvent(
  //   userId: number,
  //   eventId: number,
  //   data: UpdateUserEventDto,
  // ) {
  //   const userEvent = await this.userEventRepository.findOne({
  //     where: { id: eventId },
  //     select: ['user', 'id', 'eventName', 'eventContent', 'start', 'end'],
  //     relations: ['user'],
  //   });
  //   if (_.isNil(userEvent)) {
  //     throw new NotFoundException(`event를 찾을 수 없습니다. id:${userId}`);
  //   }
  //   if (userEvent.user.id !== userId) {
  //     throw new UnauthorizedException(
  //       `이 이벤트를 게시한 유저가 아닙니다: ${userId}`,
  //     );
  //   }
  //   this.userEventRepository.update(userEvent.id, data);
  // }

  async checkUser(userId: number, eventId: number) {
    const userEvent = await this.userEventRepository.findOne({
      where: { id: eventId, user: { id: userId } },
    });
    if (!userEvent) {
      throw new ForbiddenException(`권한이 존재하지 않습니다.`);
    }
  }
  // async updateGroupEvent(
  //   GroupId: number,
  //   eventId: number,
  //   data: UpdateGroupEventDto,
  // ) {
  //   const groupEvent = await this.groupEventRepository.findOne({
  //     where: { id: eventId },
  //     select: ['group', 'id', 'eventName', 'eventContent', 'start', 'end'],
  //     relations: ['user'],
  //   });
  //   if (_.isNil(groupEvent)) {
  //     throw new NotFoundException(`event를 찾을 수 없습니다. id:${eventId}`);
  //   }
  //   if (groupEvent.group.id !== GroupId) {
  //     throw new UnauthorizedException(
  //       `이 이벤트를 게시한 그룹이 아닙니다: ${GroupId}`,
  //     );
  //   }
  //   this.groupEventRepository.update(groupEvent.id, data);
  // }

  async memberCheck(userId, groupId) {
    const memberCheck = await this.userGroupRepository.findOneBy({
      userId,
      groupId,
      role: Not('가입대기'),
    });
    if (!memberCheck) {
      throw new ForbiddenException('그룹에 가입해야만 확인할 수 있습니다.');
    }
  }
}
