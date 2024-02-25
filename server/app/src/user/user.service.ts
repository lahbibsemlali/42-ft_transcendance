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
        if (profile) {
            console.log("founded >>...")
            return {id: profile.userId, isTwoFaEnabled: profile.twoFA}
        }
        else {
            const profile = await this.createUserProfile(userData.username, userData.imageLink)
            return {id: profile.userId, isTwoFaEnabled: profile.twoFA}
        }
    }
    async updateAvatar(userId: number, location: string) {
        const user = await prisma.profile.findFirst({
            where: {
              userId: userId,
            },
        });
        if (user) {
            await prisma.profile.update({
                where: {
                    userId: userId
                },
                data: {
                    avatar: location
                }
            })
            return {status: 201, message: "avatar uploaded successfully"}
        }
        else {
            return {status: 404, message: "user not found"};
        }
    }

    async updateUsername(userId: number, username: string) {
        const user = await prisma.profile.findFirst({
            where: {
              userId: userId,
            },
        });
        console.log(user.username, "to new username :: ", username)
        if (user) {
            await prisma.profile.update({
                where: {
                    userId: userId
                },
                data: {
                    username: username
                }
            })
            return {status: 201, message: "username has changed successfully"}
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
            console.log(userId, "----------------------------", friendId)

            await prisma.friendship.create({
                data: {
                    friend1Id: userId,
                    friend2Id: friendId
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

    async createDm(user: any, friend: any) {
        const chat = await prisma.chat.create({
          data: {
            name: friend.username,
            image: friend.avatar,
          }
        })
    
        await prisma.userChat.create({
          data: {
              userId: user.userId,
              chatId: chat.id,
              dmName: friend.username,
              dmImage: friend.avatar
          }
        })

        await prisma.userChat.create({
            data: {
                userId: friend.userId,
                chatId: chat.id,
                dmName: user.username,
                dmImage: user.avatar
            }
        })
      }
    
    async acceptFriend(userId: number, friendId: number) {

        console.log("------------------------------", userId, friendId)
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
        })
        if (!friendship)
            throw new HttpException('no such friendship', HttpStatus.INTERNAL_SERVER_ERROR)
        await prisma.friendship.update({
            where: {
                id: friendship.id
            },
            data: {
                status: 'Accepted'
            }
        })
        const user = await this.getUserById(userId)
        const friend = await this.getUserById(friendId)
        this.createDm(user, friend)
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

    async setResult(userId: number, result: number) {
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
        })
    }

    async updateGameState(id: number, state: boolean) {
        await prisma.profile.update({
            where: {
                userId: id
            },
            data: {
                inGame: state
            }
        })
    }
}
