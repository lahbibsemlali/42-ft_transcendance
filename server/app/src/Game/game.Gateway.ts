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
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';

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

  afterInit(server: Server) {}

  handleConnection(client: Socket, ...args: any[]) {}

  handleDisconnect(client: Socket) {}

  @SubscribeMessage('waiting')
  async handleWaitingEvent(client: Socket, idUser: string) {
    await this.gameService.updateStatus(idUser, false);

    let roomArray;
    const ifPlay = await this.gameService.isPlaying(idUser);
    if (!ifPlay) {
      this.gameService.setMyMap(idUser, 0);
      // await this.gameService.updateStatus(idUser, true);
      client.join(this.gameService.createRooms());
      roomArray = Array.from(client.rooms);
      this.gameService.setRoomsMap(client.id, roomArray[roomArray.length - 1]);
      if (this.gameService.getNRooms() % 2 != 0)
        this.gameService.players[0] = idUser;
      if (this.gameService.getNRooms() % 2 == 0) {
        this.gameService.players[1] = idUser;
        //set clients map
        this.gameService.setCLientsMap();
        this.server.to(roomArray[1]).emit('startgame');
        client.to(this.gameService.getRoomName(client.id)).emit('witchplayer');
      }
      client.on('disconnect', async () => {
        if (this.gameService.getRoomName(client.id) !== undefined) {
          this.gameService.deleteCLientsMap(
            this.gameService.getCLientsMap(client.id),
          );
          this.gameService.deleteCLientsMap(client.id);
          await this.gameService.setResult(idUser);
          await this.gameService.updateStatus(idUser, false);
          client.to(this.gameService.getRoomName(client.id)).emit('winer');
          client.leave(this.gameService.getRoomName(client.id));
          this.gameService.deleteRoomName(client.id);
          if (this.gameService.getNRooms() % 2 != 0) {
            this.gameService.decrementNRooms();
          }
          this.gameService.deleteScoor(idUser);
        }
      });
    } else this.server.to(client.id).emit('in game');
  }

  @SubscribeMessage('updateBallPosition')
  updateBallPosition(
    client: Socket,
    data: {
      x: number;
      y: number;
      speedX: number;
      speedY: number;
      w: number;
      h: number;
      sp1: number;
      sp2: number;
    },
  ): void {
    this.ball = {
      x: data.x,
      y: data.y,
      speedX: data.speedX,
      speedY: data.speedY,
      w: data.w,
      h: data.h,
      sp1: data.sp1,
      sp2: data.sp2,
    };
    client
      .to(this.gameService.getRoomName(client.id))
      .emit('updateBallPosition', this.ball);
  }

  @SubscribeMessage('updatePaddlePosition')
  updatePaddlePosition(
    client: Socket,
    data: { x: number; bool: boolean; w: number },
  ): void {
    this.paddle = { x: data.x, bool: data.bool, w: data.w };
    this.server
      .to(this.gameService.getRoomName(client.id))
      .emit('updatePaddlePosition', this.paddle);
  }

  @SubscribeMessage('please change my ball position')
  getBallPosition(client: Socket): void {
    client
      .to(this.gameService.getRoomName(client.id))
      .emit('please give me your ball position');
  }

  @SubscribeMessage('updateResulte') // game over
  async getResulte(client: Socket, userId: string) {
    await this.gameService.setResult(userId);
    this.gameService.deleteCLientsMap(
      this.gameService.getCLientsMap(client.id),
    );
    this.gameService.deleteCLientsMap(client.id);
    await this.gameService.updateStatus(userId, false);
    client.leave(this.gameService.getRoomName(client.id));
    this.gameService.deleteRoomName(client.id);
    this.gameService.deleteScoor(userId);
  }

  @SubscribeMessage('isVisible')
  getvisibility(client: Socket) {
    client
      .to(this.gameService.getRoomName(client.id))
      .emit('give Me your Visibility');
  }

  @SubscribeMessage('this is my visibility')
  sendvisibility(client: Socket, visibState: boolean) {
    client
      .to(this.gameService.getRoomName(client.id))
      .emit('this is the visibility', visibState);
  }

  @SubscribeMessage('updateScoor')
  updateScoor(client: Socket, data: number) {
    this.gameService.saveResult(data[0], data[1]);
  }

  @SubscribeMessage('is Game Over')
  isGameOver(client: Socket, data: number) {
    console.log('is Game Over');
    if (this.gameService.getCLientsMap(client.id) === undefined) {
      // console.log("YES");
      this.server.to(client.id).emit('Game Over');
    }
  }



  



  /////////////// CHAT EVENTS
  @SubscribeMessage('join to this chat room')
  joinToRoom(client: Socket, id: string) {
    console.log(id);
  }
}
