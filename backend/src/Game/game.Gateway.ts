import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly gameService: GameService) {}
  @WebSocketServer() server: Server;

  private ball = {
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0,
    h: 0,
    w: 0,
    sp1: 0,
    sp2: 0,
  };

  private paddle = {
    x: 0,
    bool: true,
    w: 0,
  };

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
  }

  handleDisconnect(client: Socket) {

  }

  @SubscribeMessage('waiting')
  handleWaitingEvent(client: Socket) {
    client.join(this.gameService.createRooms());
    const roomArray = Array.from(client.rooms);
    if ((this.gameService.getNRooms() % 2) == 0) {
      this.server.to(roomArray[1]).emit("startgame");
      client.to(roomArray[1]).emit("witchplayer");
    }
    client.on('disconnect', () => {
      client.to(roomArray[1]).emit("winer");
      if ((this.gameService.getNRooms() % 2) != 0) {
        this.gameService.decrementNRooms();
      }
    });
  }

    @SubscribeMessage('updateBallPosition')
    updateBallPosition(client: Socket, data: { x: number, y: number, speedX: number, speedY: number, w: number, h: number, sp1: number, sp2: number}): void {
      this.ball = { x: data.x, y: data.y, speedX: data.speedX, speedY: data.speedY, w: data.w, h: data.h, sp1: data.sp1, sp2: data.sp2};
      const roomArray = Array.from(client.rooms);
      this.server.to(roomArray[1]).emit("updateBallPosition", this.ball);
    }
      
      @SubscribeMessage('updatePaddlePosition')
      updatePaddlePosition(client: Socket, data: { x: number, bool: boolean, w: number}): void {
        this.paddle = { x: data.x, bool: data.bool, w: data.w};
        const roomArray = Array.from(client.rooms);
        this.server.to(roomArray[1]).emit("updatePaddlePosition", this.paddle);
      }

      @SubscribeMessage('visibilitychange')
      visibilityChange(client: Socket): void {
        console.log('visibilitychange');
      }

      @SubscribeMessage("please change my ball position")
      getBallPosition(client: Socket, bool: boolean): void {
        const roomArray = Array.from(client.rooms);
        this.server.to(roomArray[1]).emit('please give me your ball position', bool);
      }

      // @SubscribeMessage("please give me your score")
      // getScore(client: Socket, bool: boolean): void {
      //   this.server.emit('please give me your score', bool);
      // }
}
