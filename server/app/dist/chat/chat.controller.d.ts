import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createGroup(user: any, body: any): void;
    getChat(user: any): Promise<{
        id: number;
        name: string;
        image: string;
        isGroup: boolean;
        lastMessage: string;
    }[]>;
    addToGroup(user: any, targetId: any, groupId: any): void;
    joinGroup(user: any, groupId: any, password: any): void;
}
