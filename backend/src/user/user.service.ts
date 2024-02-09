import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient;

@Injectable()
export class UserService {
    async getUserById(userId: number) {
        const user = await prisma.profile.findUnique({
            where: {
                userId: userId,
            }
        })
        if (!user)
            throw new UnauthorizedException('no such user')
        return user
    }
    async createUserProfile(username: string, imageLink: string) {
        const user = await prisma.user.create({
            data: {}
        })
        const profile = await prisma.profile.create({
            data: {
                userId: user.id,
                username: username,
                avatar: imageLink
            }
        })
        return profile
    }
    async loginOrRegister(userData: {username: string, imageLink: string}) {
        const profile = await prisma.profile.findFirst({
            where: {
              username: userData.username,
            },
        });
        if (profile)
            return {id: profile.userId, isTwoFaEnabled: profile.twoFA}
        else {
            const profile = await this.createUserProfile(userData.username, userData.imageLink)
            return {id: profile.userId, isTwoFaEnabled: profile.twoFA}
        }
    }
    async updateAvatar(userName: string, location: string) {
        const user = await prisma.profile.findUnique({
            where: {
              username: userName,
            },
        });
        if (user) {
            console.log(location, userName)
            await prisma.profile.update({
                where: {username: userName},
                data: {avatar: location}
            })
            return {status: 201, message: "avatar uploaded successfully"}
        }
        else {
            return {status: 404, message: "user not found"};
        }
    }
    async addFriend(userName: string, friendName: string) {
        const userProfile = await prisma.profile.findUnique({
            where: {
                username: userName
            }
        })
        const friendProfile = await prisma.profile.findUnique({
            where: {
                username: friendName
            }
        })
        if (!userProfile || !friendProfile)
            return {status: 404, message: "no such user or friend"}
        const friendship = await prisma.friendship.findFirst({
            where: {
                friend1Id: userProfile.userId,
                friend2Id: friendProfile.userId,
                OR: [{
                    friend1Id: friendProfile.userId,
                    friend2Id: userProfile.userId
                }]
            }
        })
        if (!friendship) {
            await prisma.friendship.create({
                data: {
                    friend1Id: userProfile.userId,
                    friend2Id: friendProfile.userId
                }
            })
            return {status: 201, message: `user ${friendName} added successfully`}
        }
        else
            return {status: 400, message: `user ${friendName} already exists`}
    }
    async setTwoFaSecrete(userId: number, secrete: string) {
        const user = await prisma.profile.findUnique({
            where: {
                userId: userId
            }
        })
        if (!user)
            throw new UnauthorizedException("no such user");
        await prisma.profile.update({
            where: {
                userId: userId
            },
            data: {
                twoFASecrete: secrete
            }
        })
        return {status: 201, message: "2fa is set successfully"}
    }
    async turnOnUserTwoFa(userId: number) {
        const user = await prisma.profile.findUnique({
            where: {
                userId: userId
            }
        })
        if (!user)
            throw new UnauthorizedException("no such user");
        await prisma.profile.update({
            where: {
                userId: userId
            },
            data: {
                twoFA: true,
            }
        })
        return {status: 201, message: "2fa is set successfully"}
    }
}
