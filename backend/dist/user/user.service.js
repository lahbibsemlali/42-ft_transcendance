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
    async loginOrRegister(userData) {
        const user = await prisma.user.findFirst({
            where: {
                username: userData.username,
            },
        });
        if (user)
            return { id: user.id, username: user.username, status: 200 };
        else {
            await prisma.user.create({
                data: {
                    username: userData.username,
                    avatar: userData.imageLink
                },
            });
            return { id: user.id, username: user.username, status: 201 };
        }
    }
    async updateAvatar(userName, location) {
        const user = await prisma.user.findUnique({
            where: {
                username: userName,
            },
        });
        if (user) {
            console.log(location, userName);
            await prisma.user.update({
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
        const user = await prisma.user.findUnique({
            where: {
                username: userName
            }
        });
        const friend = await prisma.user.findUnique({
            where: {
                username: friendName
            }
        });
        if (!user || !friend)
            return { status: 404, message: "no such user or friend" };
        const exists = user.friends.includes(friendName);
        if (!exists) {
            await prisma.user.update({
                where: {
                    username: userName
                },
                data: {
                    friends: [...user.friends, friendName]
                }
            });
            return { status: 201, message: `user ${friendName} added successfully` };
        }
        else
            return { status: 400, message: `user ${friendName} already exists` };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map