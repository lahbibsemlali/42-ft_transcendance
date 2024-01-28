import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    cons(): void;
    consL(req: any, res: any): void;
    completeInfo(): Promise<string>;
    dashbord(): Promise<string>;
    login(data: {
        username: string;
        password: string;
    }): Promise<{
        id: number;
        username: string;
        createdAt: Date;
        updatedAt: Date;
    } | "Invalid credentials">;
    me(): Promise<{
        id: number;
        username: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    deleteAllUsers(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
