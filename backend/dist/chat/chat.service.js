"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const path_1 = require("path");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient;
let ChatService = class ChatService {
    async createGroup(userId, groupName, password, status) {
        const salt = await bcrypt.genSalt();
        const hash = status == 'Protected' && password && password.length ? await bcrypt.hash(password, salt) : null;
        const group = await prisma.chat.create({
            data: {
                name: groupName,
                image: (0, path_1.join)(__dirname, 'group-icon-original.svg'),
                isGroup: true,
                status: status,
                password: hash
            }
        });
        await prisma.userChat.create({
            data: {
                userId: userId,
                chatId: group.id
            }
        });
    }
    async addToGroup(userId, targetId, groupId) {
        const group = await prisma.chat.findFirst({
            where: {
                id: groupId
            }
        });
        const userChat = await prisma.userChat.findFirst({
            where: {
                userId: userId,
                chatId: groupId
            }
        });
        if (!userChat)
            throw new common_1.UnauthorizedException('user not in group');
        if (userChat.role != 'Owner' && userChat.role != 'Admin')
            throw new common_1.UnauthorizedException('user is neither Owner or Admin in this group');
        await prisma.userChat.create({
            data: {
                userId: targetId,
                chatId: group.id
            }
        });
    }
    async joinGroup(userId, groupId, password) {
        const group = await prisma.chat.findFirst({
            where: {
                id: groupId
            }
        });
        if (group.status == 'Private')
            throw new common_1.UnauthorizedException('group is private');
        if (group.status == 'Protected') {
            const unhashed = bcrypt.compare(password, group.password, () => {
                throw new common_1.UnauthorizedException('wrong password to joing group');
            });
        }
        await prisma.userChat.create({
            data: {
                userId: userId,
                chatId: group.id
            }
        });
    }
    async createMessage(userId, chatId, content) {
        const message = await prisma.message.create({
            data: {
                senderId: userId,
                chatId: chatId,
                body: content,
            }
        });
    }
    async getMessages(userId, chatId) {
        const messages = await prisma.message.findMany({
            where: {
                senderId: userId,
                chatId: chatId
            },
            select: {
                sender: {
                    select: {
                        profile: {
                            select: {
                                userId: true,
                                username: true
                            }
                        }
                    }
                },
                body: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        const neededForm = messages.map(message => ({
            isMe: message.sender.profile.userId == userId ? true : false,
            username: message.sender.profile.username,
            content: message.body
        }));
        return neededForm;
    }
    async getChat(userId) {
        const chat = await prisma.userChat.findMany({
            where: {
                userId: userId,
            },
            select: {
                chat: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        isGroup: true,
                        lastMessage: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        const neededForm = chat.map(ch => ({
            id: ch.chat.id,
            name: ch.chat.name,
            image: ch.chat.image,
            isGroup: ch.chat.isGroup,
            lastMessage: ch.chat.lastMessage
        }));
        return neededForm;
    }
    async searchGroups(keyword) {
        const matches = await prisma.chat.findMany({
            where: {
                name: {
                    startsWith: keyword,
                },
                isGroup: true,
                OR: [
                    {
                        status: 'Public'
                    },
                    {
                        status: 'Protected'
                    }
                ]
            },
            select: {
                name: true
            }
        });
        return matches;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)()
], ChatService);
//# sourceMappingURL=chat.service.js.map