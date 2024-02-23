import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
export declare class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly gameService;
    constructor(gameService: GameService);
    server: Server;
    private ball;
    private paddle;
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    handleWaitingEvent(client: Socket, idUser: number): Promise<void>;
    updateBallPosition(client: Socket, data: {
        x: number;
        y: number;
        speedX: number;
        speedY: number;
        w: number;
        h: number;
        sp1: number;
        sp2: number;
    }): void;
    updatePaddlePosition(client: Socket, data: {
        x: number;
        bool: boolean;
        w: number;
    }): void;
    getBallPosition(client: Socket): void;
    getResulte(client: Socket, userId: number): Promise<void>;
    getvisibility(client: Socket): void;
    sendvisibility(client: Socket, visibState: boolean): void;
    updateScoor(client: Socket, data: number): void;
    isGameOver(client: Socket, data: number): void;
    joinToRoom(client: Socket, id: string): void;
}
