import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserService } from 'src/user/user.service';

const prisma = new PrismaClient();

@Injectable()
export class GameService {
  public nRooms: number;
  public nameRoom: string;
  public scoorMap = new Map();
  public myRooms = new Map();
  public clientsMap = new Map();
  public players = [];

  constructor(private userService: UserService) {
    this.nRooms = 0;
  }

  getHello(): string {
    return 'Hello from ExampleService!';
  }

  createRooms(): string {
    if (this.nRooms % 2 == 0) {
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      this.nameRoom = '';
      for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        this.nameRoom += characters.charAt(randomIndex);
      }
    }
    this.nRooms++;
    return this.nameRoom;
  }

  getNRooms(): number {
    return this.nRooms;
  }

  decrementNRooms() {
    if (this.nRooms > 0 && this.nRooms % 2) --this.nRooms;
  }

  setMyMap(key: string, toSet: number): void {
    this.scoorMap.set(key, toSet);
  }

  setRoomsMap(key: string, nameRoom: string): void {
    this.myRooms.set(key, nameRoom);
  }

  setCLientsMap() {
    this.clientsMap.set(this.players[0], this.players[1]);
    this.clientsMap.set(this.players[1], this.players[0]);
    // console.log("players[0]", this.players[0]);
    // console.log("players[1]", this.players[1]);
  }

  getCLientsMap(id: string) {
    return this.clientsMap.get(id);
  }

  deleteCLientsMap(id: string) {
    this.clientsMap.delete(id);
  }

  getRoomName(key: string): string {
    return this.myRooms.get(key);
  }

  deleteScoor(key: string) {
    this.scoorMap.delete(key);
  }

  deleteRoomName(key: string) {
    this.myRooms.delete(key);
  }

  saveResult(key: string, result: number): void {
    // console.log(key, result);
    this.setMyMap(key, result);
  }

  async isPlaying(userId: string) {
    const user = await this.userService.getUserById(userId);
    return user.inGame;
  }

  async setResult(userId: string) {
    // console.log("resule ", userId, this.scoorMap.get(userId));
    await this.userService.setResult(userId, this.scoorMap.get(userId));
  }

  async updateStatus(userId: string, state: boolean) {
    await this.userService.updateGameState(userId, state);
  }
}
