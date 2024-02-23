"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const game_service_1 = require("./game.service");
let GameGateway = class GameGateway {
    constructor(gameService) {
        this.gameService = gameService;
        this.ball = {
            x: 0,
            y: 0,
            speedX: 0,
            speedY: 0,
            h: 0,
            w: 0,
            sp1: 0,
            sp2: 0,
        };
        this.paddle = {
            x: 0,
            bool: true,
            w: 0,
        };
    }
    afterInit(server) { }
    handleConnection(client, ...args) { }
    handleDisconnect(client) { }
    async handleWaitingEvent(client, idUser) {
        await this.gameService.updateStatus(idUser, false);
        let roomArray;
        const ifPlay = await this.gameService.isPlaying(idUser);
        if (!ifPlay) {
            this.gameService.setMyMap(idUser, 0);
            client.join(this.gameService.createRooms());
            roomArray = Array.from(client.rooms);
            this.gameService.setRoomsMap(client.id, roomArray[roomArray.length - 1]);
            if (this.gameService.getNRooms() % 2 != 0)
                this.gameService.players[0] = client.id;
            if (this.gameService.getNRooms() % 2 == 0) {
                this.gameService.players[1] = client.id;
                this.gameService.setCLientsMap();
                this.server.to(roomArray[1]).emit('startgame');
                client.to(this.gameService.getRoomName(client.id)).emit('witchplayer');
            }
            client.on('disconnect', async () => {
                if (this.gameService.getRoomName(client.id) !== undefined) {
                    this.gameService.deleteCLientsMap(this.gameService.getCLientsMap(client.id));
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
        }
        else
            this.server.to(client.id).emit('in game');
    }
    updateBallPosition(client, data) {
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
    updatePaddlePosition(client, data) {
        this.paddle = { x: data.x, bool: data.bool, w: data.w };
        this.server
            .to(this.gameService.getRoomName(client.id))
            .emit('updatePaddlePosition', this.paddle);
    }
    getBallPosition(client) {
        client
            .to(this.gameService.getRoomName(client.id))
            .emit('please give me your ball position');
    }
    async getResulte(client, userId) {
        this.gameService.deleteCLientsMap(this.gameService.getCLientsMap(client.id));
        this.gameService.deleteCLientsMap(client.id);
        await this.gameService.setResult(userId);
        await this.gameService.updateStatus(userId, false);
        client.leave(this.gameService.getRoomName(client.id));
        this.gameService.deleteRoomName(client.id);
        this.gameService.deleteScoor(userId);
    }
    getvisibility(client) {
        client
            .to(this.gameService.getRoomName(client.id))
            .emit('give Me your Visibility');
    }
    sendvisibility(client, visibState) {
        client
            .to(this.gameService.getRoomName(client.id))
            .emit('this is the visibility', visibState);
    }
    updateScoor(client, data) {
        this.gameService.saveResult(data[0], data[1]);
    }
    isGameOver(client, data) {
        console.log('is Game Over');
        if (this.gameService.getCLientsMap(client.id) === undefined) {
            this.server.to(client.id).emit('Game Over');
        }
    }
    joinToRoom(client, id) {
        console.log(id);
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('waiting'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleWaitingEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateBallPosition'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "updateBallPosition", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updatePaddlePosition'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "updatePaddlePosition", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('please change my ball position'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "getBallPosition", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateResulte'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "getResulte", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('isVisible'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "getvisibility", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('this is my visibility'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Boolean]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "sendvisibility", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateScoor'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "updateScoor", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('is Game Over'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "isGameOver", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join to this chat room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "joinToRoom", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
//# sourceMappingURL=game.Gateway.js.map