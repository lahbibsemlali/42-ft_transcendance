export declare class AuthService {
    createUser(userData: {
        username: string;
    }): Promise<{
        username: string;
        exists: boolean;
    }>;
}
