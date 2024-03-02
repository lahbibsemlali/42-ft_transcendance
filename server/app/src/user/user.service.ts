import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient;

@Injectable()
export class UserService {
    async getUserById(userId: string) {
        try {
            const user = await prisma.profile.findFirst({
                where: {
                    userId: userId,
                }
            })
            if (!user)
                throw new UnauthorizedException('no such user')
            return user
        }
        catch (err) {
            console.log('err: ', err)
        }
    }

    async createUserProfile(userId: string, username: string, imageLink: string) {
        const user = await prisma.user.create({
            data: {
                id: userId
            }
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
    async loginOrRegister(userData: {id: string, username: string, imageLink: string}) {
        const profile = await prisma.profile.findFirst({
            where: {
              userId: userData.id,
            },
        });
        if (profile) {
            console.log("founded >>...")
            return {id: profile.userId, isTwoFaEnabled: false}
        }
        else {
            const profile = await this.createUserProfile(userData.id, userData.username, userData.imageLink)
            return {id: profile.userId, isTwoFaEnabled: false}
        }
    }
    async updateAvatar(userId: string, location: string) {
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

    async updateUsername(userId: string, username: string) {
        const user = await prisma.profile.findFirst({
            where: {
              userId: userId,
            },
        });
        console.log(await prisma.profile.findMany())
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
    
    async updateTwoFa(userId: string, twoFa: boolean) {
        const user = await prisma.profile.findFirst({
            where: {
              userId: userId,
            },
        });
        console.log(user.twoFA, "to new username :: ", twoFa)
        if (user) {
            await prisma.profile.update({
                where: {
                    userId: userId
                },
                data: {
                    twoFA: twoFa
                }
            })
            return {status: 201, message: "twoFa has changed successfully"}
        }
        else {
            return {status: 404, message: "twoFa not found"};
        }
    }

    async addFriend(userId: string, friendId: string) {
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

    async getUserName(userId: string) {
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
    
    async acceptFriend(userId: string, friendId: string) {

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

    async setTwoFaSecrete(userId: string, secrete: string) {
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
    async turnOnUserTwoFa(userId: string) {
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
                    startsWith: keyword.toLowerCase()
                }
            },
            select: {
                userId: true,
                username: true
            }
        })
        console.log(keyword, '==========++', matches)
        return matches
    }

    async setResult(userId: string, result: number, oppId: string, opResult: number) {
        const me = await this.getUserById(oppId);
        const opp = await this.getUserById(userId);
        await prisma.profile.update({
            where: {
                userId: userId
            },
            data: {
                lastFive: {
                    create: {
                        pic1: me.avatar,
                        pic2: opp.avatar,
                        result: `${result} : ${opResult}`
                    }
                },
                wins: {
                    increment: result == 5 ? 1 : 0
                },
                loses: {
                    increment: result < 5 ? 1 : 0
                }
            }
        })
    }


    async getLastFive(userId: string) {
    const lastFive = await prisma.profile.findFirst({
        where: {
            userId: userId
        },
        select: {
            lastFive: {
                select: {
                    pic1: true,
                    pic2: true,
                    result: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
        
    })
    return lastFive.lastFive
    }


    async updateGameState(id: string, state: boolean) {
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
