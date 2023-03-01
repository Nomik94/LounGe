import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/database/entities/group.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create.group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  createGroup(data: CreateGroupDto): void {
    try {
      this.groupRepository.insert({
        ...data,
        user: { id: 1 },
        // entity에서 user을 객체로 받기 때문에 user : User => user : { id : 1 } 과 같은 형식으로 넣어준다? ?? User 클래스 안에 있는 id를 활용!
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
