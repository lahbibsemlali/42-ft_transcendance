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
    afterInit(server) {
        console.log('WebSocket Gateway initialized');
    }
    handleConnection(client, ...args) {
    }
    handleDisconnect(client) {
    }
    handleWaitingEvent(client) {
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
    updateBallPosition(client, data) {
        this.ball = { x: data.x, y: data.y, speedX: data.speedX, speedY: data.speedY, w: data.w, h: data.h, sp1: data.sp1, sp2: data.sp2 };
        const roomArray = Array.from(client.rooms);
        this.server.to(roomArray[1]).emit("updateBallPosition", this.ball);
    }
    updatePaddlePosition(client, data) {
        this.paddle = { x: data.x, bool: data.bool, w: data.w };
        const roomArray = Array.from(client.rooms);
        this.server.to(roomArray[1]).emit("updatePaddlePosition", this.paddle);
    }
    visibilityChange(client) {
        console.log('visibilitychange');
    }
    getBallPosition(client, bool) {
        const roomArray = Array.from(client.rooms);
        this.server.to(roomArray[1]).emit('please give me your ball position', bool);
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
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
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
    (0, websockets_1.SubscribeMessage)('visibilitychange'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "visibilityChange", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("please change my ball position"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Boolean]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "getBallPosition", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
//# sourceMappingURL=game.Gateway.js.map