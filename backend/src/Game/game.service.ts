import { Injectable } from "@nestjs/common";

@Injectable()
export class GameService {
    public nRooms: number;
    public nameRoom: string;

    constructor() {
        this.nRooms = 0;
    }

    getHello(): string {
        return 'Hello from ExampleService!';
    }

    createRooms(): string {
        if ((this.nRooms % 2) == 0) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            this.nameRoom = '';
            for (let i = 0; i < 7; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                this.nameRoom += characters.charAt(randomIndex);
            }
        }
        this.nRooms++;


        console.log("room name: ", this.nameRoom);
        return this.nameRoom;
    }

    getNRooms(): number {
        return this.nRooms;
    }

    decrementNRooms() {
        if (this.nRooms > 0)
            --this.nRooms;
    }
}