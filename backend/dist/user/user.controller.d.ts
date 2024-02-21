/// <reference types="multer" />
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    addFiend(user: any, friend: any): Promise<201 | 200>;
    acceptFriend(user: any, friendId: any): Promise<void>;
    uploadAvatar(body: any, user: any, file: Express.Multer.File): Promise<{
        status: number;
        message: string;
    }>;
    getUserId(user: any): Promise<any>;
    getAvatar(user: any, res: any): Promise<void>;
    deleteAllUsers(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
