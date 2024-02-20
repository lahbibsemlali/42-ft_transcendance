export declare class UserService {
    getUserById(userId: number): Promise<{
        userId: number;
        username: string;
        twoFA: boolean;
        twoFASecrete: string;
        avatar: string;
        state: number;
        inGame: boolean;
        wins: number;
        loses: number;
    }>;
    createUserProfile(username: string, imageLink: string): Promise<{
        userId: number;
        username: string;
        twoFA: boolean;
        twoFASecrete: string;
        avatar: string;
        state: number;
        inGame: boolean;
        wins: number;
        loses: number;
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
    addFriend(userId: number, friendId: number): Promise<201 | 200>;
    getUserName(userId: number): Promise<{
        username: string;
    }>;
    createDm(userId: number, target: {
        username: string;
        avatar: string;
    }): Promise<void>;
    acceptFriend(userId: number, friendId: number): Promise<void>;
    setTwoFaSecrete(userId: number, secrete: string): Promise<{
        status: number;
        message: string;
    }>;
    turnOnUserTwoFa(userId: number): Promise<{
        status: number;
        message: string;
    }>;
    searchUser(keyword: string): Promise<{
        username: string;
    }[]>;
    setResult(userId: number, result: number): Promise<void>;
    updateGameState(id: number, state: boolean): Promise<void>;
}
