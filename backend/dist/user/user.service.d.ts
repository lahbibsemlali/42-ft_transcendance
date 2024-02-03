export declare class UserService {
    loginOrRegister(userData: {
        username: string;
        imageLink: string;
    }): Promise<{
        id: number;
        username: string;
        status: number;
    }>;
    updateAvatar(userName: string, location: string): Promise<{
        status: number;
        message: string;
    }>;
    addFriend(userName: string, friendName: string): Promise<{
        status: number;
        message: string;
    }>;
}
