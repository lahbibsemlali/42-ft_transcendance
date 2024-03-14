// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { UserService } from 'src/user/user.service';

// const prisma = new PrismaClient();

// @Injectable()
// export class GameService {
//   public nRooms: number;
//   public nameRoom: string;
//   public scoorMap = new Map();
//   public myRooms = new Map();
//   public clientsMap = new Map();
//   public players = [];

//   constructor(private userService: UserService) {
//     this.nRooms = 0;
//   }

//   getHello(): string {
//     return 'Hello from ExampleService!';
//   }

//   createRooms(): string {
//     if (this.nRooms % 2 == 0) {
//       const characters =
//         'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//       this.nameRoom = '';
//       for (let i = 0; i < 7; i++) {
//         const randomIndex = Math.floor(Math.random() * characters.length);
//         this.nameRoom += characters.charAt(randomIndex);
//       }
//     }
//     this.nRooms++;
//     return this.nameRoom;
//   }

//   getNRooms(): number {
//     return this.nRooms;
//   }

//   decrementNRooms() {
//     if (this.nRooms > 0 && this.nRooms % 2) --this.nRooms;
//   }

//   setMyMap(key: number, toSet: number): void {
//     this.scoorMap.set(key, toSet);
//   }

//   setRoomsMap(key: string, nameRoom: string): void {
//     this.myRooms.set(key, nameRoom);
//   }

//   setCLientsMap() {
//     this.clientsMap.set(this.players[0], this.players[1]);
//     this.clientsMap.set(this.players[1], this.players[0]);
//     // console.log("players[0]", this.players[0]);
//     // console.log("players[1]", this.players[1]);
//   }

//   getCLientsMap(id: string) {
//     return this.clientsMap.get(id);
//   }

//   deleteCLientsMap(id: string) {
//     this.clientsMap.delete(id);
//   }

//   getRoomName(key: string): string {
//     return this.myRooms.get(key);
//   }

//   deleteScoor(key: number) {
//     this.scoorMap.delete(key);
//   }

//   deleteRoomName(key: string) {
//     this.myRooms.delete(key);
//   }

//   saveResult(key: number, result: number): void {
//     // console.log(key, result);
//     this.setMyMap(key, result);
//   }

//   async isPlaying(userId: number) {
//     const user = await this.userService.getUserById(userId);
//     return user.inGame;
//   }

//   async setResult(userId: number) {
//     // console.log("resule ", userId, this.scoorMap.get(userId));
//     await this.userService.setResult(userId, this.scoorMap.get(userId), this.clientsMap.get(userId), this.scoorMap.get(this.clientsMap.get(userId)));
//   }

//   async updateStatus(userId: number, state: boolean) {
//     await this.userService.updateGameState(userId, state);
//   }









  
// }


import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { GameGateway } from './game.Gateway';


const prisma = new PrismaClient();

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  xSpeed: number;
  ySpeed: number;
}

interface GameState {
  // upPaddle: GameObject;
  // downPaddle: GameObject;
  ball: GameObject;
  score: number;
  userId: number;
  roomName: string;
  startGame: boolean;
}

@Injectable()
export class GameService {
  public nRooms: number;
  public nameRoom: string;
  public clientsId = new Map();
  public players = [];
  public SocketsInGame = new Map();
  public ScoorPlayers = new Map();

  constructor(private userService: UserService) {
    this.nRooms = 0;
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

  setSocketsInGame(nameSocket: string, nameRoom: string) {
    this.SocketsInGame.set(nameSocket, nameRoom);
  }

  isSocketInGame(nameSocket: string): boolean {
    if (this.SocketsInGame.get(nameSocket) === undefined) return false;
    return true;
  }

  getPlayerRoom(nameRoom: string): string {
    return this.SocketsInGame.get(nameRoom);
  }

  deleteSocketsInGame(nameSocket: string) {
    this.SocketsInGame.delete(nameSocket);
  }

  setClientsId() {
    this.clientsId.set(this.players[0], this.players[1]);
    this.clientsId.set(this.players[1], this.players[0]);
  }

  getClientsId(id: number) {
    return this.clientsId.get(id);
  }

  deleteClientsId(id: number) {
    this.clientsId.delete(id);
  }

  setScoorPlayers(idUser: number): void {
    this.ScoorPlayers.set(idUser, 0);
  }

  getScoorPlayer(idUser: number): number {
    return this.ScoorPlayers.get(idUser);
  }

  updateScoorPlayer(idUser: number): void {
    this.ScoorPlayers.set(idUser, this.getScoorPlayer(idUser) + 1);
  }

  deleteScoorPlayer(idUser: number) {
    this.ScoorPlayers.delete(idUser);
  }

  async isPlaying(userId: number) {
    const user = await this.userService.getUserById(userId);
    return user.inGame;
  }

  async setResult(userId: number) {
    // console.log('1', userId)
    // console.log('2', this.getScoorPlayer(userId))
    // console.log('3', this.getClientsId(userId))
    // console.log('4', this.getScoorPlayer(this.getClientsId(userId)))
    await this.userService.setResult(userId, this.getScoorPlayer(userId), this.getClientsId(userId), this.getScoorPlayer(this.getClientsId(userId)));
  }

  async setResult2(userId: number) {
    await this.userService.setResult(userId, 5, this.getClientsId(userId), this.getScoorPlayer(this.getClientsId(userId)));
  }

  async setResult3(userId: number) {
    await this.userService.setResult(userId, this.getScoorPlayer(userId), this.getClientsId(userId), 5);
  }

  async updateStatus(userId: number, state: boolean) {
    await this.userService.updateGameState(userId, state);
  }
  async incrementState(userId: number) {
    const user = await this.userService.getUserById(userId)

    await prisma.profile.update({
        where: {
            userId: userId
        },
        data: {
            state: {
                increment: 1
            }
        }
    })
}

async decrementState(userId: number) {
    const user = await this.userService.getUserById(userId)

    if (await this.getState(userId) > 0) {
      await prisma.profile.update({
          where: {
              userId: userId
          },
          data: {
              state: {
                  decrement: 1
              }
          }
      })
    }
}


async getState(userId: number) {
  const user = await prisma.profile.findFirst({
    where: {
      userId: userId
    },
    select: {
      state: true
    }
  })
  return user.state
}
}