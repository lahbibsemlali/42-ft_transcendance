import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient;

@Injectable()
export class UserService {
    async getUserById(userId: number) {
        const user = await prisma.profile.findFirst({
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
        const user = await prisma.profile.findFirst({
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
    async addFriend(userId: number, friendId: number) {
        const userProfile = await prisma.profile.findFirst({
            where: {
                userId: userId
            }
        })
        const friendProfile = await prisma.profile.findFirst({
            where: {
                userId: friendId
            }
        })
        if (!userProfile || !friendProfile)
            throw new UnauthorizedException("no such user or friend")
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
                    friend1Id: userId,
                    friend2Id: userId
                }
            })

            return 201
        }
        else
            return 200
    }

    async getUserName(userId: number) {
        const name = await prisma.profile.findFirst({
            where: {
                userId: userId
            },
            select: {
                username: true
            }
        })
        return name
    }

    async createDm(userId: number, target: {username: string, avatar: string}) {
        const chat = await prisma.chat.create({
          data: {
            name: target.username,
            image: target.avatar,
          }
        })
    
        await prisma.userChat.create({
          data: {
            userId: userId,
            chatId: chat.id
          }
        })
      }
    
    async acceptFriend(userId: number, friendId: number) {
        const friendship = await prisma.friendship.findFirst({
            where: {
                friend1Id: userId,
                friend2Id: friendId
            }
        })
        if (!friendship)
            throw new HttpException('no such friendship', HttpStatus.INTERNAL_SERVER_ERROR)
        await prisma.friendship.update({
            where: {
                friend1Id_friend2Id: {
                    friend1Id: userId,
                    friend2Id: friendId
                }
            },
            data: {
                status: 'Accepted'
            }
        })
        const friend: {username: string, avatar: string} = await this.getUserById(friendId)
        this.createDm(userId, friend)
    }

    async setTwoFaSecrete(userId: number, secrete: string) {
        const user = await prisma.profile.findFirst({
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
        const user = await prisma.profile.findFirst({
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

    async searchUser(keyword: string) {
        const matches = await prisma.profile.findMany({
            where: {
                username: {
                    startsWith: keyword
                }
            },
            select: {
                username: true
            }
        })
        return matches
    }
}
