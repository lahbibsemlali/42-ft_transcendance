import { UserService } from "src/user/user.service";
export declare class GameService {
    private userService;
    nRooms: number;
    nameRoom: string;
    constructor(userService: UserService);
    getHello(): string;
    createRooms(): string;
    getNRooms(): number;
    decrementNRooms(): void;
    isPlaying(userId: number): Promise<boolean>;
    setResult(userId: number, result: number): Promise<void>;
    updateStatus(userId: number, state: boolean): Promise<void>;
}
