// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayInit,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { GameService } from './game.service';
// import { ChatService } from 'src/chat/chat.service';
// import { UseGuards } from '@nestjs/common';
// import { JwtGuard } from 'src/guards/jwt.guard';

// @UseGuards(JwtGuard)
// @WebSocketGateway()
// export class GameGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   constructor(private readonly gameService: GameService, private readonly chatservice: ChatService) {}
//   @WebSocketServer() server: Server;

//   private ball = {
//     x: 0,
//     y: 0,
//     speedX: 0,
//     speedY: 0,
//     h: 0,
//     w: 0,
//     sp1: 0,
//     sp2: 0,
//   };

//   private paddle = {
//     x: 0,
//     bool: true,
//     w: 0,
//   };

//   afterInit(server: Server) {}

//   handleConnection(client: Socket, ...args: any[]) {}

//   handleDisconnect(client: Socket) {}

//   @SubscribeMessage('waiting')
//   async handleWaitingEvent(client: Socket, idUser: number) {
//     await this.gameService.updateStatus(idUser, false);

//     let roomArray;
//     const ifPlay = await this.gameService.isPlaying(idUser);
//     if (!ifPlay) {
//       this.gameService.setMyMap(idUser, 0);
//       // await this.gameService.updateStatus(idUser, true);
//       client.join(this.gameService.createRooms());
//       roomArray = Array.from(client.rooms);
//       this.gameService.setRoomsMap(client.id, roomArray[roomArray.length - 1]);
//       if (this.gameService.getNRooms() % 2 != 0)
//         this.gameService.players[0] = client.id;
//       if (this.gameService.getNRooms() % 2 == 0) {
//         this.gameService.players[1] = client.id;
//         //set clients map
//         this.gameService.setCLientsMap();
//         this.server.to(roomArray[1]).emit('startgame');
//         client.to(this.gameService.getRoomName(client.id)).emit('witchplayer');
//       }
//       client.on('disconnect', async () => {
//         if (this.gameService.getRoomName(client.id) !== undefined) {
//           this.gameService.deleteCLientsMap(
//             this.gameService.getCLientsMap(client.id),
//           );
//           this.gameService.deleteCLientsMap(client.id);
//           await this.gameService.setResult(idUser);
//           await this.gameService.updateStatus(idUser, false);
//           client.to(this.gameService.getRoomName(client.id)).emit('winer');
//           client.leave(this.gameService.getRoomName(client.id));
//           this.gameService.deleteRoomName(client.id);
//           if (this.gameService.getNRooms() % 2 != 0) {
//             this.gameService.decrementNRooms();
//           }
//           this.gameService.deleteScoor(idUser);
//         }
//       });
//     } else this.server.to(client.id).emit('in game');
//   }

//   @SubscribeMessage('updateBallPosition')
//   updateBallPosition(
//     client: Socket,
//     data: {
//       x: number;
//       y: number;
//       speedX: number;
//       speedY: number;
//       w: number;
//       h: number;
//       sp1: number;
//       sp2: number;
//     },
//   ): void {
//     this.ball = {
//       x: data.x,
//       y: data.y,
//       speedX: data.speedX,
//       speedY: data.speedY,
//       w: data.w,
//       h: data.h,
//       sp1: data.sp1,
//       sp2: data.sp2,
//     };
//     client
//       .to(this.gameService.getRoomName(client.id))
//       .emit('updateBallPosition', this.ball);
//   }

//   @SubscribeMessage('updatePaddlePosition')
//   updatePaddlePosition(
//     client: Socket,
//     data: { x: number; bool: boolean; w: number },
//   ): void {
//     this.paddle = { x: data.x, bool: data.bool, w: data.w };
//     this.server
//       .to(this.gameService.getRoomName(client.id))
//       .emit('updatePaddlePosition', this.paddle);
//   }

//   @SubscribeMessage('please change my ball position')
//   getBallPosition(client: Socket): void {
//     client
//       .to(this.gameService.getRoomName(client.id))
//       .emit('please give me your ball position');
//   }

//   @SubscribeMessage('updateResulte') // game over
//   async getResulte(client: Socket, userId: number) {
//     this.gameService.deleteCLientsMap(
//       this.gameService.getCLientsMap(client.id),
//     );
//     this.gameService.deleteCLientsMap(client.id);
//     await this.gameService.setResult(userId);
//     await this.gameService.updateStatus(userId, false);
//     client.leave(this.gameService.getRoomName(client.id));
//     this.gameService.deleteRoomName(client.id);
//     this.gameService.deleteScoor(userId);
//   }

//   @SubscribeMessage('isVisible')
//   getvisibility(client: Socket) {
//     client
//       .to(this.gameService.getRoomName(client.id))
//       .emit('give Me your Visibility');
//   }

//   @SubscribeMessage('this is my visibility')
//   sendvisibility(client: Socket, visibState: boolean) {
//     client
//       .to(this.gameService.getRoomName(client.id))
//       .emit('this is the visibility', visibState);
//   }

//   @SubscribeMessage('updateScoor')
//   updateScoor(client: Socket, data: number) {
//     this.gameService.saveResult(data[0], data[1]);
//   }

//   @SubscribeMessage('is Game Over')
//   isGameOver(client: Socket, data: number) {
//     console.log('is Game Over');
//     if (this.gameService.getCLientsMap(client.id) === undefined) {
//       this.server.to(client.id).emit('Game Over');
//     }
//   }

//   @SubscribeMessage('exit')
//   GameOver(client: Socket, data: number) {
//     client.to(this.gameService.getRoomName(client.id)).emit('winer');
//   }

//   @SubscribeMessage('back')
//   GameOverlos(client: Socket, data: number) {
//     this.server.to(client.id).emit('Game Over');
//   }

  
// }























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
import { User } from 'src/user/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';
import { JwtService } from '@nestjs/jwt';

@UseGuards(JwtGuard)
@WebSocketGateway()
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly gameService: GameService, private readonly chatservice: ChatService, private jwtService: JwtService) {}
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
      nameRoom: '',
    };

    private paddle = {
      x: 0,
      bool: true,
      w: 0,
      nameRoom: '',
    };

  afterInit(server: Server) {}

  async handleConnection(client, ...args: any[]) {
    const token = client?.handshake?.headers?.cookie?.trim().split('jwt=')[1]
    let user: any;
    try {
      if (token) {
        user = await this.jwtService.verify(token, {
          secret: process.env.JWT_SECRETE
        });
      }
    } catch (error) {}
    client.join(user?.id.toString());
    // console.log('con', client?.id, user?.id);
    // console.log('client.rooms', client.rooms)
  }

  async handleDisconnect(client: Socket) {
    const token = client?.handshake?.headers?.cookie?.trim().split('jwt=')[1]
    let user: any;
    try {
      if (token) {
        user = await this.jwtService.verify(token, {
          secret: process.env.JWT_SECRETE
        });
      }
    } catch (error) {}
    if (this.gameService.isSocketInGame(client.id)) {
      client.to(this.gameService.getPlayerRoom(client.id)).emit('winer');
      if (this.gameService.getNRooms() % 2 != 0)
        this.gameService.decrementNRooms();
      await this.gameService.updateStatus(user.id, false);
      if (this.gameService.getClientsId(user.id) !== undefined)
        this.gameService.setResult3(user.id)
      this.gameService.deleteSocketsInGame(client.id);
      this.gameService.deleteClientsId(user.id);
      // this.gameService.deleteScoorPlayer(user.id);
    }
  }


  @SubscribeMessage('waiting')
  async getRoom(client) {
    const UserId = client['user'].id;
    await this.gameService.updateStatus(UserId, false);
    const ifPlay = await this.gameService.isPlaying(UserId);
    if (!ifPlay) {
      // await this.gameService.updateStatus(UserId, true);
      this.gameService.setScoorPlayers(UserId);
      const nameRoom = this.gameService.createRooms();
      client.join(nameRoom);
      this.server.to(client.id).emit('room created', nameRoom);
      this.gameService.setSocketsInGame(client.id, nameRoom);
      if (this.gameService.getNRooms() % 2 != 0)
        this.gameService.players[0] = UserId;
      if (this.gameService.getNRooms() % 2 == 0) {
        this.gameService.players[1] = UserId;
        this.server.to(nameRoom).emit('start game');
        client.to(nameRoom).emit('witchplayer');
        this.gameService.setClientsId();
      }
    } else this.server.to(client.id).emit('in game');
  }

  @SubscribeMessage('waiting')
  async generatCustomRoom(client) {
    const UserId = client['user'].id;
    await this.gameService.updateStatus(UserId, false);
    const ifPlay = await this.gameService.isPlaying(UserId);
    if (!ifPlay) {
      // await this.gameService.updateStatus(UserId, true);
      this.gameService.setScoorPlayers(UserId);
      const nameRoom = this.gameService.createRooms();
      client.join(nameRoom);
      this.server.to(client.id).emit('room created', nameRoom);
      this.gameService.setSocketsInGame(client.id, nameRoom);
      if (this.gameService.getNRooms() % 2 != 0)
        this.gameService.players[0] = UserId;
      if (this.gameService.getNRooms() % 2 == 0) {
        this.gameService.players[1] = UserId;
        this.server.to(nameRoom).emit('start game');
        client.to(nameRoom).emit('witchplayer');
        this.gameService.setClientsId();
      }
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
        nameRoom: string;
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
        nameRoom: data.nameRoom,
      };
      if (this.gameService.isSocketInGame(client.id))
        client.to(data.nameRoom).emit('updateBallPosition', this.ball);
    }


  @SubscribeMessage('updatePaddlePosition')
  updatePaddlePosition(
    client: Socket,
    data: { x: number; bool: boolean; w: number; nameRoom: string },
  ): void {
    this.paddle = { x: data.x, bool: data.bool, w: data.w, nameRoom: data.nameRoom };
    if (this.gameService.isSocketInGame(client.id))
      this.server.to(data.nameRoom).emit('updatePaddlePosition', this.paddle);
  }

    @SubscribeMessage('updateResulte') // game over
    async getResulte(client: Socket, data: {nameRoom: string, bool: boolean}) {
      console.log('update scoor', 'nameRoom', data.nameRoom,'bool', data.bool)
      if (this.gameService.isSocketInGame(client.id) && this.gameService.getPlayerRoom(client.id) === data.nameRoom) {
        // client.to(this.gameService.getPlayerRoom(client.id)).emit('winer');
        if (this.gameService.getNRooms() % 2 != 0)
          this.gameService.decrementNRooms();
        await this.gameService.updateStatus(client['user'].id, false);
        if (this.gameService.getClientsId(client['user'].id) !== undefined) {
          if (data.bool)
            this.gameService.setResult(client['user'].id)
          else
            this.gameService.setResult2(client['user'].id)
        }
        this.gameService.deleteSocketsInGame(client.id);
        this.gameService.deleteClientsId(client['user'].id);
        // this.gameService.deleteScoorPlayer(client['user'].id);
    }
    }





      @SubscribeMessage('updateScoor')
      updateScoor(client: Socket, nameRoom: string) {
        if (this.gameService.isSocketInGame(client.id) && this.gameService.getPlayerRoom(client.id) === nameRoom)
          this.gameService.updateScoorPlayer(client['user'].id);
      }

        @SubscribeMessage('exit')
        async GameOver(client: Socket, nameRoom: string) {
          if (this.gameService.isSocketInGame(client.id) && this.gameService.getPlayerRoom(client.id) === nameRoom) {
              client.to(this.gameService.getPlayerRoom(client.id)).emit('winer');
              if (this.gameService.getNRooms() % 2 != 0)
                this.gameService.decrementNRooms();
              await this.gameService.updateStatus(client['user'].id, false);
              if (this.gameService.getClientsId(client['user'].id) !== undefined)
                this.gameService.setResult3(client['user'].id)
              this.gameService.deleteSocketsInGame(client.id);
              this.gameService.deleteClientsId(client['user'].id);
              // this.gameService.deleteScoorPlayer(client['user'].id);
          }
        }

  @SubscribeMessage('back')
  GameOverlos(client: Socket, nameRoom: string) {
    if (this.gameService.isSocketInGame(client.id) && this.gameService.getPlayerRoom(client.id) === nameRoom)
      this.server.to(client.id).emit('Game Over');
  }

  @SubscribeMessage('customRoom')
  async customRoom(client: Socket, idUser: string) {
    const ifPlay = await this.gameService.isPlaying(client['user'].id);
    if (!ifPlay)
      this.server.to(idUser).emit('customRoom', client['user'].id.toString());
  }

  /////////////// CHAT EVENTS
  @SubscribeMessage('join to this chat room')
  joinToRoom(client: Socket, id: string) {
    client.join(id)
  }

  @SubscribeMessage('send msg')
  sendMsg(client: Socket, data) {
    let nameRoom = data[1];
    this.chatservice.createMessage(client['user'].id, data[1], data[0]);
    this.server.to(nameRoom.toString()).emit('send msg');
  }
}
