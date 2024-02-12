export declare class UserService {
    getUserById(userId: number): Promise<{
        userId: number;
        username: string;
        twoFA: boolean;
        twoFASecrete: string;
        avatar: string;
    }>;
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
        isTwoFaEnabled: boolean;
    }>;
    updateAvatar(userName: string, location: string): Promise<{
        status: number;
        message: string;
    }>;
    addFriend(userName: string, friendName: string): Promise<{
        status: number;
        message: string;
    }>;
    setTwoFaSecrete(userId: number, secrete: string): Promise<{
        status: number;
        message: string;
    }>;
    turnOnUserTwoFa(userId: number): Promise<{
        status: number;
        message: string;
    }>;
}
