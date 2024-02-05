export declare class UserService {
    createUserProfile(username: string, imageLink: string): Promise<{
        userId: number;
        username: string;
        twoFA: boolean;
        twoFASecrete: string;
        avatar: string;
    }>;
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
    setUserTwoFASecrete(username: string, secrete: string): Promise<{
        status: number;
        message: string;
    }>;
}
