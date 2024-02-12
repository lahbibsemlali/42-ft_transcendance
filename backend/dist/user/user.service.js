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
    async addFriend(userName, friendName) {
        const userProfile = await prisma.profile.findFirst({
            where: {
                username: userName
            }
        });
        const friendProfile = await prisma.profile.findFirst({
            where: {
                username: friendName
            }
        });
        if (!userProfile || !friendProfile)
            return { status: 404, message: "no such user or friend" };
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
            await prisma.friendship.create({
                data: {
                    friend1Id: userProfile.userId,
                    friend2Id: friendProfile.userId
                }
            });
            return { status: 201, message: `user ${friendName} added successfully` };
        }
        else
            return { status: 400, message: `user ${friendName} already exists` };
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
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map