import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient;

@Injectable()
export class UserService {
    async getUserById(userId: number) {
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

    async createUserProfile(username: string, email: string, imageLink: string) {
        const user = await prisma.user.create({data: {}})
        const profile = await prisma.profile.create({
            data: {
                userId: user.id,
                username: username,
                email: email,
                avatar: imageLink
            }
        })
        return profile
    }

    async loginOrRegister(userData: {id: string, username: string, email: string, imageLink: string}) {
        const profile = await prisma.profile.findFirst({
            where: {
              email: userData.email,
            },
        });
        if (profile)
            return {id: profile.userId, isTwoFaEnabled: false}
        else {
            const profile = await this.createUserProfile(userData.username, userData.email, userData.imageLink)
            return {id: profile.userId, isTwoFaEnabled: false}
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
    
    async updateTwoFa(userId: number, twoFa: boolean) {
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
                OR: [{
                    friend1Id: userId,
                    friend2Id: friendId,
                },
                {
                    friend1Id: friendId,
                    friend2Id: userId
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
        }
    }

    async getFriendStatus(userId: number, friendId: number) {
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
                OR: [{
                    friend1Id: userId,
                    friend2Id: friendId,
                },
                {
                    friend1Id: friendId,
                    friend2Id: userId
                }]
            }
        })
        console.log(friendship)
        if (!friendship)
            return 0
        else if (friendship.status == 'Pending' && friendship.friend1Id == userId)
            return 1
        else if (friendship.status == 'Pending')
            return 2
        else
            return 3
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

    async removeFriend(userId: number, friendId: number) {

        console.log("------------------------------", typeof userId, typeof friendId)
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
            throw new BadRequestException('no such friendship')
        await prisma.friendship.delete({
            where: {
                id: friendship.id
            }
        })
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

    async setResult(userId: number, result: number, oppId: number, opResult: number) {
        const me = await this.getUserById(userId);
        const opp = await this.getUserById(oppId);
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


    async getLastFive(userId: number) {
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


    async updateGameState(userId: number, state: boolean) {
        await prisma.profile.update({
            where: {
                userId: userId
            },
            data: {
                inGame: state
            }
        })
    }
}
