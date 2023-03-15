import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { GroupNewsFeed } from './database/entities/group-newsfeed.entity';
import { Group } from './database/entities/group.entity';
import { UserGroup } from './database/entities/user-group.entity';

@Injectable()
export class AppService {
  @InjectRepository(Group)
  private readonly groupRepository: Repository<Group>;
  @InjectRepository(UserGroup)
  private readonly userGroupRepository: Repository<UserGroup>;
  @InjectRepository(GroupNewsFeed)
  private readonly groupNewsfeedRepository: Repository<GroupNewsFeed>;

  async groupInfo(groupId) {
    const group = await this.groupRepository.findOne({
      relations: ['user', 'groupEvents'],
      where: { id: groupId },
    });
    const memberCount = await this.userGroupRepository.count({
      where: { groupId, role: Not('가입대기') },
    });

    const newMembers = await this.userGroupRepository.find({
      where: { groupId, role: Not('가입대기') },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const newsfeedCount = await this.groupNewsfeedRepository.count({
      where: { groupId },
    });
    return {
      groupId: group.id,
      groupName: group.groupName,
      groupDesc: group.description,
      groupImage: group.groupImage,
      groupBackImg: group.backgroundImage,
      groupCreatedAt: group.createdAt.toLocaleString(),
      leader: group.user.username,
      leaderEmail: group.user.email,
      memberCount,
      events: group.groupEvents,
      newMembers: newMembers.map((member) => ({
        memberName: member.user.username,
        memberImage: member.user.image,
        memberJoinedAt: member.createdAt.toLocaleString(), //추후 업데이트로 변경해야함
      })),
      newsfeedCount,
    };
  }
}
