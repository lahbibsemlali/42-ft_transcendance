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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const user_service_1 = require("../user/user.service");
const prisma = new client_1.PrismaClient();
let GameService = class GameService {
    constructor(userService) {
        this.userService = userService;
        this.scoorMap = new Map();
        this.myRooms = new Map();
        this.clientsMap = new Map();
        this.players = [];
        this.nRooms = 0;
    }
    getHello() {
        return 'Hello from ExampleService!';
    }
    createRooms() {
        if (this.nRooms % 2 == 0) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            this.nameRoom = '';
            for (let i = 0; i < 7; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                this.nameRoom += characters.charAt(randomIndex);
            }
        }
        this.nRooms++;
        return this.nameRoom;
    }
    getNRooms() {
        return this.nRooms;
    }
    decrementNRooms() {
        if (this.nRooms > 0 && this.nRooms % 2)
            --this.nRooms;
    }
    setMyMap(key, toSet) {
        this.scoorMap.set(key, toSet);
    }
    setRoomsMap(key, nameRoom) {
        this.myRooms.set(key, nameRoom);
    }
    setCLientsMap() {
        this.clientsMap.set(this.players[0], this.players[1]);
        this.clientsMap.set(this.players[1], this.players[0]);
    }
    getCLientsMap(id) {
        return this.clientsMap.get(id);
    }
    deleteCLientsMap(id) {
        this.clientsMap.delete(id);
    }
    getRoomName(key) {
        return this.myRooms.get(key);
    }
    deleteScoor(key) {
        this.scoorMap.delete(key);
    }
    deleteRoomName(key) {
        this.myRooms.delete(key);
    }
    saveResult(key, result) {
        this.setMyMap(key, result);
    }
    async isPlaying(userId) {
        const user = await this.userService.getUserById(userId);
        return user.inGame;
    }
    async setResult(userId) {
        await this.userService.setResult(userId, this.scoorMap.get(userId));
    }
    async updateStatus(userId, state) {
        await this.userService.updateGameState(userId, state);
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], GameService);
//# sourceMappingURL=game.service.js.map