export declare class ChatService {
    createGroup(userId: number, groupName: string, password: string, status: any): Promise<void>;
    addToGroup(userId: number, targetId: number, groupId: number): Promise<void>;
    joinGroup(userId: number, groupId: number, password: string): Promise<void>;
    createMessage(userId: number, chatId: number, content: string): Promise<void>;
    getMessages(userId: number, chatId: number): Promise<{
        isMe: boolean;
        username: string;
        content: string;
    }[]>;
    getChat(userId: number): Promise<{
        id: number;
        name: string;
        image: string;
        isGroup: boolean;
        lastMessage: string;
    }[]>;
    searchGroups(keyword: string): Promise<{
        name: string;
    }[]>;
}
