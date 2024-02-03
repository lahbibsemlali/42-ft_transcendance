/// <reference types="multer" />
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    addFiend(body: {
        user: string;
        friend: string;
    }): Promise<{
        status: number;
        message: string;
    }>;
    test(): Promise<void>;
    uploadAvatar(userName: string, file: Express.Multer.File): Promise<"errrror" | {
        status: number;
        message: string;
    }>;
    me(): Promise<{
        id: number;
        username: string;
        createdAt: Date;
        updatedAt: Date;
        friends: string[];
        status: import(".prisma/client").$Enums.Status;
        avatar: string;
    }[]>;
    deleteAllUsers(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
