import _ from 'lodash';
import { Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEvent } from 'src/database/entities/userEvent.entity';
import { Repository } from 'typeorm';
import { GroupEvent } from 'src/database/entities/groupEvent.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(UserEvent)
    private readonly userEventRepository: Repository<UserEvent>,
    @InjectRepository(GroupEvent)
    private readonly groupEventRepository: Repository<GroupEvent>,
  ){}

  // userEvents 
  async getUserEvent(){
    return await this.userEventRepository.find({
      where: {deletedAt:null},
      select: ["eventName","createdAt"],
    });
  }

  async getUserEventById(eventId:number){
    return this.userEventRepository.findOne({
      where: {id:eventId, deletedAt:null },
      select:["eventName","eventContent","createdAt"],
    })
  }

  // getAllUserEvent(userId:number)/*:Promise<UserEvent>*/{
  //   return this.userEventRepository.find({
  //     where: {
  //       id: userId,
  //     }
  //   })
  // }

  createUserEvent(
    eventName: string, 
    eventContent: string, 
    start:string, 
    end:string, 
    userId:number, ){
      this.userEventRepository.insert({
        eventName,
        eventContent, 
        start,
        end,
        user:{id:userId}
      })
    };

  async updateUserEvent(
    eventId: number,
    eventName: string, 
    eventContent: string, 
    start:string, 
    end:string, 
    userId:number,
    ){
      const userEvent = await this.userEventRepository.findOne({
        where: {id:eventId},
        select: ["user","id","eventName","eventContent","start","end"],
        relations:["user"],
      })
      console.log(userEvent)
      if (_.isNil(userEvent)){
        throw new NotFoundException(`event를 찾을 수 없습니다. id:${userId}`);
      }
      if (userEvent.user.id!==userId){
        throw new UnauthorizedException(`이 이벤트를 게시한 유저가 맞으신가요?? 유저id가 맞지 않습니다: ${userId}`);
      }
      this.userEventRepository.update(userEvent.id, {eventName,eventContent,start,end})
    }

    async deleteUserEvent(eventId: number, userId: number){
      await this.checkUser(eventId,userId);
      this.userEventRepository.softDelete(eventId)
    }
    private async checkUser(eventId: number, userId: number){
      const userEvent = await this.userEventRepository.findOne({
        where:{id:eventId},
        select:["user"],
        relations:["user"],
      });
      if(_.isNil(userEvent)){
        throw new NotFoundException(`userEvent를 찾을 수 없습니다. id: ${eventId}`)
      } 
      if(userEvent.user.id !== userId){
        throw new UnauthorizedException(`이 이벤트를 게시한 유저가 아닙니다. id: ${userId}`)
      }
    }

  
  // groupEvents
  private groupEvents = [];
  private eventsGroupId = new Map();
  

  getGroupEvent() {
    return this.groupEvents;
  }

  getGroupEventById(eventId:number){
    return this.groupEvents.find((events)=>{return events.id===eventId;})
  }

  createGroupEvent(
    eventName: string, 
    eventContent: string, 
    start:string, 
    end:string, 
    groupId:number, ){
      const eventId = this.groupEvents.length + 1;
      this.groupEvents.push({id:eventId,eventName,
        eventContent, 
        start,
        end
      })
      this.eventsGroupId.set(eventId,groupId);
      return eventId;
    }

  updateGroupEvent(
    eventId: number,
    eventName: string, 
    eventContent: string, 
    start:string, 
    end:string, 
    groupId:number,
    ){
      if (this.eventsGroupId.get(eventId)!==groupId){
        throw new UnauthorizedException('이 이벤트를 개시한 그룹이 맞으신가요?? 그룹id가 맞지 않습니다.'+groupId);
      }
      const event = this.getGroupEventById(eventId);
      console.log(this.getGroupEventById(eventId))
      if (_.isNil(event)){
        throw new NotFoundException('event를 찾을 수 없습니다. id:'+eventId);
      }

      event.eventName = eventName;
      event.eventContent = eventContent;
      event.start = start;
      event.end = end;
    }

  deleteGroupEvent(eventId: number, groupId: number){
    if (this.eventsGroupId.get(eventId)!==groupId){
    throw new UnauthorizedException('이 이벤트를 개시한 그룹이 맞으신가요?? 그룹id가 맞지 않습니다.'+groupId);
  }

  this.groupEvents = this.groupEvents.filter((events)=>{return events.id !== eventId});

  }
}
