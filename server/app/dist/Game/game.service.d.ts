import { UserService } from 'src/user/user.service';
export declare class GameService {
    private userService;
    nRooms: number;
    nameRoom: string;
    scoorMap: Map<any, any>;
    myRooms: Map<any, any>;
    clientsMap: Map<any, any>;
    players: any[];
    constructor(userService: UserService);
    getHello(): string;
    createRooms(): string;
    getNRooms(): number;
    decrementNRooms(): void;
    setMyMap(key: number, toSet: number): void;
    setRoomsMap(key: string, nameRoom: string): void;
    setCLientsMap(): void;
    getCLientsMap(id: string): any;
    deleteCLientsMap(id: string): void;
    getRoomName(key: string): string;
    deleteScoor(key: number): void;
    deleteRoomName(key: string): void;
    saveResult(key: number, result: number): void;
    isPlaying(userId: number): Promise<boolean>;
    setResult(userId: number): Promise<void>;
    updateStatus(userId: number, state: boolean): Promise<void>;
}
