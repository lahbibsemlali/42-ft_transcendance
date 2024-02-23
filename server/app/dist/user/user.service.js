"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient;
let UserService = class UserService {
    async getUserById(userId) {
        const user = await prisma.profile.findFirst({
            where: {
                userId: userId,
            }
        });
        if (!user)
            throw new common_1.UnauthorizedException('no such user');
        return user;
    }
    async createUserProfile(username, imageLink) {
        const user = await prisma.user.create({
            data: {}
        });
        const profile = await prisma.profile.create({
            data: {
                userId: user.id,
                username: username,
                avatar: imageLink
            }
        });
        return profile;
    }
    async loginOrRegister(userData) {
        const profile = await prisma.profile.findFirst({
            where: {
                username: userData.username,
            },
        });
        if (profile)
            return { id: profile.userId, isTwoFaEnabled: profile.twoFA };
        else {
            const profile = await this.createUserProfile(userData.username, userData.imageLink);
            return { id: profile.userId, isTwoFaEnabled: profile.twoFA };
        }
    }
    async updateAvatar(userName, location) {
        const user = await prisma.profile.findFirst({
            where: {
                username: userName,
            },
        });
        if (user) {
            console.log(location, userName);
            await prisma.profile.update({
                where: { username: userName },
                data: { avatar: location }
            });
            return { status: 201, message: "avatar uploaded successfully" };
        }
        else {
            return { status: 404, message: "user not found" };
        }
    }
    async addFriend(userId, friendId) {
        const userProfile = await prisma.profile.findFirst({
            where: {
                userId: userId
            }
        });
        const friendProfile = await prisma.profile.findFirst({
            where: {
                userId: friendId
            }
        });
        if (!userProfile || !friendProfile)
            throw new common_1.UnauthorizedException("no such user or friend");
        const friendship = await prisma.friendship.findFirst({
            where: {
                friend1Id: userProfile.userId,
                friend2Id: friendProfile.userId,
                OR: [{
                        friend1Id: friendProfile.userId,
                        friend2Id: userProfile.userId
                    }]
            }
        });
        if (!friendship) {
            console.log(userId, "----------------------------", friendId);
            await prisma.friendship.create({
                data: {
                    friend1Id: userId,
                    friend2Id: friendId
                }
            });
            return 201;
        }
        else
            return 200;
    }
    async getUserName(userId) {
        const name = await prisma.profile.findFirst({
            where: {
                userId: userId
            },
            select: {
                username: true
            }
        });
        return name;
    }
    async createDm(user, friend) {
        const chat = await prisma.chat.create({
            data: {
                name: friend.username,
                image: friend.avatar,
            }
        });
        await prisma.userChat.create({
            data: {
                userId: user.userId,
                chatId: chat.id,
                dmName: friend.username,
                dmImage: friend.avatar
            }
        });
        await prisma.userChat.create({
            data: {
                userId: friend.userId,
                chatId: chat.id,
                dmName: user.username,
                dmImage: user.avatar
            }
        });
    }
    async acceptFriend(userId, friendId) {
        console.log("------------------------------", userId, friendId);
        const friendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    {
                        friend1Id: userId,
                        friend2Id: friendId
                    },
                    {
                        friend2Id: userId,
                        friend1Id: friendId
                    }
                ],
            }
        });
        if (!friendship)
            throw new common_1.HttpException('no such friendship', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        await prisma.friendship.update({
            where: {
                id: friendship.id
            },
            data: {
                status: 'Accepted'
            }
        });
        const user = await this.getUserById(userId);
        const friend = await this.getUserById(friendId);
        this.createDm(user, friend);
    }
    async setTwoFaSecrete(userId, secrete) {
        const user = await prisma.profile.findFirst({
            where: {
                userId: userId
            }
        });
        if (!user)
            throw new common_1.UnauthorizedException("no such user");
        await prisma.profile.update({
            where: {
                userId: userId
            },
            data: {
                twoFASecrete: secrete
            }
        });
        return { status: 201, message: "2fa is set successfully" };
    }
    async turnOnUserTwoFa(userId) {
        const user = await prisma.profile.findFirst({
            where: {
                userId: userId
            }
        });
        if (!user)
            throw new common_1.UnauthorizedException("no such user");
        await prisma.profile.update({
            where: {
                userId: userId
            },
            data: {
                twoFA: true,
            }
        });
        return { status: 201, message: "2fa is set successfully" };
    }
    async searchUser(keyword) {
        const matches = await prisma.profile.findMany({
            where: {
                username: {
                    startsWith: keyword
                }
            },
            select: {
                username: true
            }
        });
        return matches;
    }
    async setResult(userId, result) {
        await prisma.profile.update({
            where: {
                userId: userId
            },
            data: {
                wins: {
                    increment: result == 5 ? 1 : 0
                },
                loses: {
                    increment: result < 5 ? 1 : 0
                }
            }
        });
    }
    async updateGameState(id, state) {
        await prisma.profile.update({
            where: {
                userId: id
            },
            data: {
                inGame: state
            }
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map