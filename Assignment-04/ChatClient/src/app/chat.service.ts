import { Injectable } from '@angular/core';
import { EventBusService } from './event-bus.service';
import { User } from './user';

import { Observable, Subject } from 'rxjs';
import { Room } from './room';

import { filter } from 'rxjs/operators';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private static EVENTBUS = '/api/eventbus';

  private static SEND_ADDRESS = 'chat.to.server';

  private static EVENT_BUS_PREFIX = 'chat.to.client';
  private static NEW_USER = ChatService.EVENT_BUS_PREFIX + '.newUser';
  private static DELETE_USER = ChatService.EVENT_BUS_PREFIX + '.deleteUser';
  private static ROOMS = ChatService.EVENT_BUS_PREFIX + '.rooms';
  private static NEW_ROOM = ChatService.EVENT_BUS_PREFIX + '.newRoom';
  private static GET_ROOM = ChatService.EVENT_BUS_PREFIX + '.getRoom';
  private static DELETE_ROOM = ChatService.EVENT_BUS_PREFIX + '.deleteRoom';
  private static JOIN_ROOM = ChatService.EVENT_BUS_PREFIX + '.joinRoom';
  private static LEAVE_ROOM = ChatService.EVENT_BUS_PREFIX + '.leaveRoom';
  private static NEW_MESSAGE = ChatService.EVENT_BUS_PREFIX + '.newMessage';
  private static ENTER_CS = ChatService.EVENT_BUS_PREFIX + '.enterCS';
  private static EXIT_CS = ChatService.EVENT_BUS_PREFIX + '.exitCS';
  private static TIMEOUT_EXPIRED = ChatService.EVENT_BUS_PREFIX + '.timeoutExpired';

  public user: User = {
    id: 0,
    name: ''
  };
  public room: Room = {
    id: 0,
    name: ''
  };

  private newUser: Subject<User>;
  private deleteUser: Subject<number>;
  private rooms: Subject<Room[]>;
  private newRoom: Subject<Room>;
  private getRoom: Subject<Room>;
  private deleteRoom: Subject<number>;
  private joinRoom: Subject<any>;
  private leaveRoom: Subject<any>;
  private newMessage: Subject<any>;
  private enterCS: Subject<any>;
  private exitCS: Subject<any>;
  private timeoutExpired: Subject<Room>;

  constructor(private eventBus: EventBusService) {
    eventBus.connect(ChatService.EVENTBUS);

    this.newUser = new Subject<User>();
    this.deleteUser = new Subject<number>();
    this.rooms = new Subject<Room[]>();
    this.newRoom = new Subject<Room>();
    this.getRoom = new Subject<Room>();
    this.deleteRoom = new Subject<number>();
    this.joinRoom = new Subject<any>();
    this.leaveRoom = new Subject<any>();
    this.newMessage = new Subject<any>();
    this.enterCS = new Subject<any>();
    this.exitCS = new Subject<any>();
    this.timeoutExpired = new Subject<Room>();

    eventBus.registerHandler(ChatService.NEW_USER, (err, msg) => {
      this.newUser.next(msg.body);
    });

    eventBus.registerHandler(ChatService.DELETE_USER, (err, msg) => {
      this.deleteUser.next(msg.body);
    });

    eventBus.registerHandler(ChatService.ROOMS, (err, msg) => {
      this.rooms.next(msg.body);
    });

    eventBus.registerHandler(ChatService.NEW_ROOM, (err, msg) => {
      this.newRoom.next(msg.body);
    });

    eventBus.registerHandler(ChatService.GET_ROOM, (err, msg) => {
      this.getRoom.next(msg.body);
    });

    eventBus.registerHandler(ChatService.DELETE_ROOM, (err, msg) => {
      this.deleteRoom.next(msg.body);
    });

    eventBus.registerHandler(ChatService.JOIN_ROOM, (err, msg) => {
      this.joinRoom.next(msg.body);
    });

    eventBus.registerHandler(ChatService.LEAVE_ROOM, (err, msg) => {
      this.leaveRoom.next(msg.body);
    });

    eventBus.registerHandler(ChatService.NEW_MESSAGE, (err, msg) => {
      this.newMessage.next(msg.body);
    });

    eventBus.registerHandler(ChatService.ENTER_CS, (err, msg) => {
      this.enterCS.next(msg.body);
    });

    eventBus.registerHandler(ChatService.EXIT_CS, (err, msg) => {
      this.exitCS.next(msg.body);
    });

    eventBus.registerHandler(ChatService.TIMEOUT_EXPIRED, (err, msg) => {
      this.timeoutExpired.next(msg.body);
    });
  }

  sendNewUser(user: User) {
    this.eventBus.send(ChatService.SEND_ADDRESS, {
      type: 'newUser',
      request: user
    });
  }

  sendDeleteUser() {
    this.eventBus.send(ChatService.SEND_ADDRESS, {
      type: 'deleteUser',
      request: {
        userId: this.user.id
      }
    });
    this.user.id = 0;
    this.user.name = '';
  }

  sendRooms() {
    this.eventBus.send(ChatService.SEND_ADDRESS, {
      type: 'rooms'
    });
  }

  sendNewRoom(room: Room) {
    this.eventBus.send(ChatService.SEND_ADDRESS, {
      type: 'newRoom',
      request: room
    });
  }

  sendGetRoom(roomId: number) {
    this.eventBus.send(ChatService.SEND_ADDRESS, {
      type: 'newRoom',
      request: {
        roomId
      }
    });
  }

  sendDeleteRoom(room: Room) {
    this.eventBus.send(ChatService.SEND_ADDRESS, {
      type: 'deleteRoom',
      request: {
        roomId: room.id
      }
    });
  }

  sendJoinRoom() {
    this.eventBus.send(ChatService.SEND_ADDRESS, {
      type: 'joinRoom',
      request: {
        roomId: this.room.id,
        user: this.user
      }
    });
  }

  sendLeaveRoom() {
    if (this.room) {
      this.eventBus.send(ChatService.SEND_ADDRESS, {
        type: 'leaveRoom',
        request: {
          roomId: this.room.id,
          user: this.user
        }
      });
    }
    this.room.id = 0;
    this.room.name = '';
  }

  sendNewMessage(content: string) {
    if (this.room.id > 0) {
      this.eventBus.send(ChatService.SEND_ADDRESS, {
        type: 'newMessage',
        request: {
          room: this.room,
          user: this.user,
          content,
          userClock: 0
        }
      });
    }
  }

  sendEnterCS() {
    this.eventBus.send(ChatService.SEND_ADDRESS, {
      type: 'enterCS',
      request: {
        roomId: this.room.id,
        user: this.user
      }
    });
  }

  sendExitCS() {
    this.eventBus.send(ChatService.SEND_ADDRESS, {
      type: 'exitCS',
      request: {
        roomId: this.room.id,
        user: this.user
      }
    });
  }

  onNewUser(): Observable<User> {
    return this.newUser.asObservable();
  }

  onDeleteUser(): Observable<number> {
    return this.deleteUser.asObservable();
  }

  onRooms(): Observable<Room[]> {
    return this.rooms.asObservable();
  }

  onNewRoom(): Observable<Room> {
    return this.newRoom.asObservable();
  }

  onGetRoom(): Observable<Room> {
    return this.getRoom.asObservable();
  }

  onDeleteRoom(): Observable<number> {
    return this.deleteRoom.asObservable();
  }

  onJoinRoom(): Observable<any> {
    return this.joinRoom.asObservable();
  }

  onLeaveRoom(): Observable<any> {
    return this.leaveRoom.asObservable();
  }

  onNewMessage(): Observable<any> {
    return this.newMessage
      .asObservable()
      .pipe(filter(message => this.room && message.room.id === this.room.id));
  }

  onEnterCS(): Observable<any> {
    return this.enterCS.asObservable();
  }

  onExitCS(): Observable<any> {
    return this.exitCS.asObservable();
  }

  onTimeoutExpired(): Observable<Room> {
    return this.timeoutExpired.asObservable();
  }

}