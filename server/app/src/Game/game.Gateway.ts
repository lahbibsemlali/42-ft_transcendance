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
  constructor(
    private readonly gameService: GameService,
    private readonly chatservice: ChatService,
    private jwtService: JwtService,
  ) {}
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
    const token = client?.handshake?.headers?.cookie?.trim().split('jwt=')[1];
    let user: any;
    try {
      if (token) {
        user = await this.jwtService.verify(token, {
          secret: process.env.JWT_SECRETE,
        });
      }
    } catch (error) {}
    client.join(user?.id.toString());
    if (user && user.id)
      await this.gameService.incrementState(user?.id);

    console.log(user?.id, await this.gameService.getState(user?.id));

    // console.log('con', client?.id, user?.id);
    // console.log('client.rooms', client.rooms)
  }

  async handleDisconnect(client: Socket) {
    const token = client?.handshake?.headers?.cookie?.trim().split('jwt=')[1];
    let user: any;
    try {
      if (token) {
        user = await this.jwtService.verify(token, {
          secret: process.env.JWT_SECRETE,
        });
      }
    } catch (error) {}
    if (this.gameService.isSocketInGame(client.id)) {
      client.to(this.gameService.getPlayerRoom(client.id)).emit('winer');
      if (this.gameService.getNRooms() % 2 != 0)
        this.gameService.decrementNRooms();
      await this.gameService.updateStatus(user.id, false);
      if (this.gameService.getClientsId(user.id) !== undefined)
        this.gameService.setResult3(user.id);
      this.gameService.deleteSocketsInGame(client.id);
      this.gameService.deleteClientsId(user.id);
      // this.gameService.deleteScoorPlayer(user.id);
    }
    if (user && user.id)
      await this.gameService.decrementState(user?.id);
    console.log(user?.id, await this.gameService.getState(user?.id));
    // console.log('discon', client?.id, user?.id);
  }



  @SubscribeMessage('waiting')
  async getRoom(client: Socket) {
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

  @SubscribeMessage('runCustomRoom')
  async generatCustomRoom(client: Socket, data) {
    const UserId = client['user'].id;
    await this.gameService.updateStatus(UserId, false);
    const ifPlay = await this.gameService.isPlaying(UserId);
    if (!ifPlay) {
      // await this.gameService.updateStatus(UserId, true);
      this.gameService.setScoorPlayers(UserId);
      // const nameRoom = this.gameService.createRooms();
      client.join(data[0]);
      this.server.to(data[0]).emit('room created', data[0]);
      this.gameService.setSocketsInGame(client.id, data[0]);
      // if (this.gameService.getNRooms() % 2 != 0)
      if (data[2] != '1')
        this.gameService.players[0] = UserId;
      console.log('this.gameService.players[0]', UserId);
      // if (this.gameService.getNRooms() % 2 == 0) {
        if (data[2] == '1') {
        this.gameService.players[1] = parseInt(data[1]);
        this.server.to(data[0]).emit('start game');
        client.to(data[0]).emit('witchplayer');
        this.gameService.setClientsId();
      }
      // }
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
    this.paddle = {
      x: data.x,
      bool: data.bool,
      w: data.w,
      nameRoom: data.nameRoom,
    };
    if (this.gameService.isSocketInGame(client.id))
      this.server.to(data.nameRoom).emit('updatePaddlePosition', this.paddle);
  }

  @SubscribeMessage('updateResulte') // game over
  async getResulte(client: Socket, data: { nameRoom: string; bool: boolean }) {
    console.log('update scoor', 'nameRoom', data.nameRoom, 'bool', data.bool);
    if (
      this.gameService.isSocketInGame(client.id) &&
      this.gameService.getPlayerRoom(client.id) === data.nameRoom
    ) {
      // client.to(this.gameService.getPlayerRoom(client.id)).emit('winer');
      if (this.gameService.getNRooms() % 2 != 0)
        this.gameService.decrementNRooms();
      await this.gameService.updateStatus(client['user'].id, false);
      if (this.gameService.getClientsId(client['user'].id) !== undefined) {
        if (data.bool) this.gameService.setResult(client['user'].id);
        else this.gameService.setResult2(client['user'].id);
      }
      this.gameService.deleteSocketsInGame(client.id);
      this.gameService.deleteClientsId(client['user'].id);
      // this.gameService.deleteScoorPlayer(client['user'].id);
    }
  }

  @SubscribeMessage('updateScoor')
  updateScoor(client: Socket, nameRoom: string) {
    if (
      this.gameService.isSocketInGame(client.id) &&
      this.gameService.getPlayerRoom(client.id) === nameRoom
    )
      this.gameService.updateScoorPlayer(client['user'].id);
  }

  @SubscribeMessage('exit')
  async GameOver(client: Socket, nameRoom: string) {
    if (
      this.gameService.isSocketInGame(client.id) &&
      this.gameService.getPlayerRoom(client.id) === nameRoom
    ) {
      console.log('exit');
      client.to(this.gameService.getPlayerRoom(client.id)).emit('winer');
      if (this.gameService.getNRooms() % 2 != 0)
        this.gameService.decrementNRooms();
      await this.gameService.updateStatus(client['user'].id, false);
      if (this.gameService.getClientsId(client['user'].id) !== undefined)
        this.gameService.setResult3(client['user'].id);
    }
  }

  @SubscribeMessage('back')
  GameOverlos(client: Socket, ifPlay: boolean) {
    if (!ifPlay) this.server.to(client.id).emit('restPlay');
    if (this.gameService.isSocketInGame(client.id) && ifPlay) {
      this.server.to(client.id).emit('Game Over');
      this.gameService.deleteSocketsInGame(client.id);
      this.gameService.deleteClientsId(client['user'].id);
    }
  }

  @SubscribeMessage('customRoom')
  async customRoom(client: Socket, idUser: string) {
    const ifPlay = await this.gameService.isPlaying(client['user'].id);
    if (!ifPlay) {
      const room = idUser + client['user'].id.toString() + 'custom';
      client.join(room);
      this.server
        .to(idUser)
        .emit('customRoom', client['user'].id.toString(), room, idUser);
    }
  }

  @SubscribeMessage('accepted')
  async Accept(client: Socket, idUser: string) {
    const ifPlay = await this.gameService.isPlaying(client['user'].id);
    if (!ifPlay) {
      const room = client['user'].id.toString() + idUser + 'custom';
      client.join(room);
      this.server.to(room);
      this.server.to(idUser).emit('accepted', room, idUser);

      // console.log(client['user'].id.toString(), client.rooms)
    }
    // console.log('idUser', idUser)
  }

  /////////////// CHAT EVENTS
  @SubscribeMessage('join to this chat room')
  joinToRoom(client: Socket, id: string) {
    client.join(id);
  }

  @SubscribeMessage('send msg')
  sendMsg(client: Socket, data) {
    let nameRoom = data[1];
    this.chatservice.createMessage(client['user'].id, data[1], data[0]);
    this.server.to(nameRoom.toString()).emit('send msg');
  }
}
