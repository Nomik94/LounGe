import _ from 'lodash';
import { Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';

@Injectable()
export class CalendarService {
  // userEvents
  private userEvents = [];
  private eventsUserId = new Map();
  

  getUserEvent() {
    return this.userEvents;
  }

  getUserEventById(eventId:number){
    return this.userEvents.find((events)=>{return events.id===eventId;})
  }

  createUserEvent(
    eventName: string, 
    eventContent: string, 
    start:string, 
    end:string, 
    userId:number, ){
      const eventId = this.userEvents.length + 1;
      this.userEvents.push({id:eventId,eventName,
        eventContent, 
        start,
        end
      })
      this.eventsUserId.set(eventId,userId);
      return eventId;
    }

  updateUserEvent(
    eventId: number,
    eventName: string, 
    eventContent: string, 
    start:string, 
    end:string, 
    userId:number,
    ){
      if (this.eventsUserId.get(eventId)!==userId){
        throw new UnauthorizedException('이 이벤트를 개시한 유저가 맞으신가요?? 유저id가 맞지 않습니다.'+userId);
      }
      const event = this.getUserEventById(eventId);
      console.log(this.getUserEventById(eventId))
      if (_.isNil(event)){
        throw new NotFoundException('event를 찾을 수 없습니다. id:'+eventId);
      }

      event.eventName = eventName;
      event.eventContent = eventContent;
      event.start = start;
      event.end = end;
    }

  deleteUserEvent(eventId: number, userId: number){
    if (this.eventsUserId.get(eventId)!==userId){
    throw new UnauthorizedException('이 이벤트를 게시한 유저가 맞으신가요?? 유저id가 맞지 않습니다.'+userId);
  }

  this.userEvents = this.userEvents.filter((events)=>{return events.id !== eventId});

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
