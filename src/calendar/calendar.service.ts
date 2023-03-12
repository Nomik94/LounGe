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

  // userEvents
  async getUserEvent() {
    return await this.userEventRepository.find({
      where: { deletedAt: null },
      select: ['eventName', 'createdAt'],
    });
  }

  async getUserEventById(eventId: number) {
    return this.userEventRepository.findOne({
      where: { id: eventId, deletedAt: null },
      select: ['eventName', 'eventContent', 'createdAt'],
    });
  }

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

  async updateUserEvent(
    userId: number,
    eventId: number,
    data: UpdateUserEventDto,
  ) {
    const userEvent = await this.userEventRepository.findOne({
      where: { id: eventId },
      select: ['user', 'id', 'eventName', 'eventContent', 'start', 'end'],
      relations: ['user'],
    });
    console.log(userEvent);
    if (_.isNil(userEvent)) {
      throw new NotFoundException(`event를 찾을 수 없습니다. id:${userId}`);
    }
    if (userEvent.user.id !== userId) {
      throw new UnauthorizedException(
        `이 이벤트를 게시한 유저가 아닙니다: ${userId}`,
      );
    }
    this.userEventRepository.update(userEvent.id, data);
  }

  async deleteUserEvent(eventId: number, userId: number) {
    await this.checkUser(eventId, userId);
    this.userEventRepository.softDelete(eventId);
  }
  private async checkUser(eventId: number, userId: number) {
    const userEvent = await this.userEventRepository.findOne({
      where: { id: eventId },
      select: ['user'],
      relations: ['user'],
    });
    if (_.isNil(userEvent)) {
      throw new NotFoundException(
        `userEvent를 찾을 수 없습니다. id: ${eventId}`,
      );
    }
    if (userEvent.user.id !== userId) {
      throw new UnauthorizedException(
        `이 이벤트를 게시한 유저가 아닙니다. id: ${userId}`,
      );
    }
  }

  // groupEvents
  async getGroupEvent(userId, groupId) {
    const checkMember = await this.userGroupRepository.findOneBy({
      userId,
      groupId,
      role : Not('가입대기')
    });
    console.log(checkMember)
    if (!checkMember) {
      throw new ForbiddenException('일정을 확인하려면 그룹에 가입하세요.');
    }
    return await this.groupEventRepository.findBy({ group: { id: groupId } });
  }

  async getGroupEventById(eventId: number) {
    return this.groupEventRepository.findOne({
      where: { id: eventId, deletedAt: null },
      select: ['eventName', 'eventContent', 'createdAt'],
    });
  }

  async updateGroupEvent(
    GroupId: number,
    eventId: number,
    data: UpdateGroupEventDto,
  ) {
    const groupEvent = await this.groupEventRepository.findOne({
      where: { id: eventId },
      select: ['group', 'id', 'eventName', 'eventContent', 'start', 'end'],
      relations: ['user'],
    });
    if (_.isNil(groupEvent)) {
      throw new NotFoundException(`event를 찾을 수 없습니다. id:${eventId}`);
    }
    if (groupEvent.group.id !== GroupId) {
      throw new UnauthorizedException(
        `이 이벤트를 게시한 그룹이 아닙니다: ${GroupId}`,
      );
    }
    this.groupEventRepository.update(groupEvent.id, data);
  }

  async deleteGroupEvent(eventId: number, groupId: number) {
    await this.checkGroup(eventId, groupId);
    this.groupEventRepository.softDelete(eventId);
  }
  private async checkGroup(eventId: number, groupId: number) {
    const groupEvent = await this.groupEventRepository.findOne({
      where: { id: eventId },
      select: ['group'],
      relations: ['group'],
    });
    if (_.isNil(groupEvent)) {
      throw new NotFoundException(
        `groupEvent를 찾을 수 없습니다. id: ${eventId}`,
      );
    }
    if (groupEvent.group.id !== groupId) {
      throw new UnauthorizedException(
        `이 이벤트를 게시한 유저가 아닙니다. id: ${groupId}`,
      );
    }
  }
}
