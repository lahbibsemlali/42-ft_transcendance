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

@WebSocketGateway()
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly gameService: GameService) {}
  @WebSocketServer() server: Server;

  afterInit(server: Server) {}

  handleConnection(client: Socket, ...args: any[]) {}

  handleDisconnect(client: Socket) {}

  @UseGuards(JwtGuard)
  @SubscribeMessage('waiting')
  getRoom(client: Socket, @User() user) {
    const id = user.id
    // Extract headers from the socket connection
    const headers = client;
    // Access the token from the headers
    const token = headers;

    console.log(id);
  }


  



  /////////////// CHAT EVENTS
  @SubscribeMessage('join to this chat room')
  joinToRoom(client: Socket, id: string) {
    console.log(id);
  }
}
