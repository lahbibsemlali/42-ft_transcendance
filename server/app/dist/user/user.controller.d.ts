/// <reference types="multer" />
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    addFiend(user: any, friend: any): Promise<201 | 200>;
    acceptFriend(user: any, friendId: any): Promise<void>;
    uploadAvatar(userName: string, file: Express.Multer.File): Promise<"errrror" | {
        status: number;
        message: string;
    }>;
    getUserId(user: any): Promise<any>;
    getAvatar(user: any): Promise<{
        avatarUrl: string;
    }>;
    deleteAllUsers(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
