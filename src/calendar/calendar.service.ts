import _ from 'lodash';
import { Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';

@Injectable()
export class CalendarService {

  private events = [];
  private eventsGroupId = new Map();
  

  getEvent() {
    return this.events;
  }

  getEventById(eventId:number){
    return this.events.find((events)=>{return events.id===eventId;})
  }

  createEvent(
    eventName: string, 
    eventContent: string, 
    // start:Date, 
    // end:Date, 
    groupId:number, ){
      const eventId = this.events.length + 1;
      this.events.push({id:eventId,eventName,
        eventContent, 
        // start,
        // end
      })
      this.eventsGroupId.set(eventId,groupId);
      return eventId;
    }

  updateEvent(
    eventId: number,
    eventName: string, 
    eventContent: string, 
    // start:Date, 
    // end:Date, 
    groupId:number,
    ){
      if (this.eventsGroupId.get(eventId)!==groupId){
        throw new UnauthorizedException('이 이벤트를 개시한 그룹이 맞으신가요?? 그룹id가 맞지 않습니다.'+groupId);
      }
      const event = this.getEventById(eventId);
      console.log(this.getEventById(eventId))
      if (_.isNil(event)){
        throw new NotFoundException('event를 찾을 수 없습니다. id:'+eventId);
      }

      event.eventName = eventName;
      event.eventContent = eventContent;
      // event.start = start;
      // event.end = end;
    }

  deleteEvent(eventId: number, groupId: number){
    if (this.eventsGroupId.get(groupId)!==groupId){
    throw new UnauthorizedException('이 이벤트를 개시한 그룹이 맞으신가요?? 그룹id가 맞지 않습니다.'+groupId);
  }

  this.events = this.events.filter((events)=>{return events.id !== eventId});

  }
}
