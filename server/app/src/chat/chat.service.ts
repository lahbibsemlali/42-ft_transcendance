import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class ChatService {
  async createGroup(
    userId: number,
    groupName: string,
    password: string,
    status: number,
  ) {
    const salt = await bcrypt.genSalt();
    const hash =
      status == 3 && password && password.length
        ? await bcrypt.hash(password, salt)
        : null;
    const group = await prisma.chat.create({
      data: {
        name: groupName,
        image: join(__dirname, 'group-icon-original.svg'),
        isGroup: true,
        status: status == 1 ? 'Public' : status == 2 ? 'Private' : 'Protected',
        password: hash,
      },
    });
    await prisma.userChat.create({
      data: {
        userId: userId,
        chatId: group.id,
        role: 'Owner',
      },
    });
  }

  async blockOrUnblock(userId: number, targetId: number, block: boolean) {
    if (block) {
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          blocked: {
            connect: [{id: targetId}]
          }
        }
      })
      await prisma.user.update({
        where: {
          id: targetId
        },
        data: {
          blocked: {
            connect: [{id: userId}]
          }
        }
      })
    }
    else {
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          blocked: {
            disconnect: [{id: targetId}]
          }
        }
      })
      await prisma.user.update({
        where: {
          id: targetId
        },
        data: {
          blocked: {
            disconnect: [{id: userId}]
          }
        }
      })
    }
  }


  async muteOrUnmute(
    userId: number,
    targetId: number,
    chatId: number,
    mute: boolean,
  ) {
    console.log(userId, chatId, 'mute is :', mute);
    await prisma.userChat.update({
      where: {
        userId_chatId: {
          userId: targetId,
          chatId: chatId,
        },
      },
      data: {
        isMutted: mute,
      },
    });
    await prisma.userChat.update({
      where: {
        userId_chatId: {
          userId: userId,
          chatId: chatId,
        },
      },
      data: {
        isMutted: mute,
      },
    });
  }

  async kick(targetId: number, chatId: number, mute: boolean) {
    const chat = await prisma.userChat.delete({
      where: {
        userId_chatId: {
          userId: targetId,
          chatId: chatId,
        },
      },
    });
  }

  async ban(targetId: number, chatId: number, mute: boolean) {
    await prisma.userChat.update({
      where: {
        userId_chatId: {
          userId: targetId,
          chatId: chatId,
        },
      },
      data: {
        isBanned: true,
      },
    });
  }

  async addToGroup(userId: number, targetId: number, groupId: number) {
    const group = await prisma.chat.findFirst({
      where: {
        id: groupId,
      },
    });
    const userChat = await prisma.userChat.findFirst({
      where: {
        userId: userId,
        chatId: groupId,
      },
    });
    if (!userChat) throw new UnauthorizedException('user not in group');
    if (userChat.role != 'Owner' && userChat.role != 'Admin')
      throw new UnauthorizedException(
        'user is neither Owner or Admin in this group',
      );
    await prisma.userChat.create({
      data: {
        userId: targetId,
        chatId: group.id,
      },
    });
  }

  async joinGroup(userId: number, groupId: number, password: string) {
    const group = await prisma.chat.findFirst({
      where: {
        id: groupId,
      },
    });
    if (group.status == 'Private')
      throw new UnauthorizedException('group is private');
    if (group.status == 'Protected') {
      const unhashed = bcrypt.compare(password, group.password, () => {
        throw new UnauthorizedException('wrong password to joing group');
      });
    }
    await prisma.userChat.create({
      data: {
        userId: userId,
        chatId: group.id,
      },
    });
  }

  async createMessage(userId: number, chatId: number, content: string) {
    const chat = await prisma.userChat.findMany({
      where: {
        chatId: chatId
      },
      select: {
        chat: {
          select: {
            isGroup: true
          }
        },
        userId: true
      }
    })

    const isBlocked = !chat[0].chat.isGroup && await this.isBlocked(chat[0].userId, chat[1].userId)
    console.log(isBlocked)
    if (!isBlocked) {
    const message = await prisma.message.create({
        data: {
          senderId: userId,
          chatId: chatId,
          body: content,
        },
      });
    }
  }

  async isBlocked(f1Id: number, f2Id: number) {
    const user = await prisma.user.findFirst({
      where: {
        id: f1Id
      },
      select: {
        blocked: {
          select: {
            id: true
          }
        }
      }
    })
    return user.blocked.includes({id: f2Id})
  }

  async getMessages(userId: number, chatId: number) {
    const messages = await prisma.message.findMany({
      where: {
        chatId: chatId
      },
      select: {
        sender: {
          select: {
            chat: {
              select: {
                isMutted: true,
                chatId: true,
              },
            },
            profile: {
              select: {
                userId: true,
                avatar: true,
              },
            },
          },
        },
        body: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    let fitlered = messages.filter(async (message) => await !this.isBlocked(userId, message.sender.profile.userId) )
    const neededForm = fitlered.map((message) => ({
      isMe: message.sender.profile.userId == userId ? true : false,
      userId: message.sender.profile.userId,
      avatar: message.sender.profile.avatar,
      content: message.body,
    }));
    console.log( neededForm)
    return neededForm
  }

  async getChat(userId: number) {
    const chat = await prisma.userChat.findMany({
      where: {
        userId: userId,
        isBanned: false,
      },
      select: {
        user: {
          select: {
            profile: {
              select: {
                state: true,
              },
            },
          },
        },
        chat: {
          select: {
            id: true,
            name: true,
            image: true,
            status: true,
            isGroup: true,
            lastMessage: true,
          },
        },
        isMutted: true,
        role: true,
        dmName: true,
        dmImage: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    const neededForm = chat.map((ch) => ({
      id: ch.chat.id,
      name: ch.chat.isGroup ? ch.chat.name : ch.dmName,
      image: ch.chat.isGroup ? ch.chat.image : ch.dmImage,
      state: ch.user.profile.state,
      isProtected: ch.chat.status == 'Protected',
      isAdmin: ch.role == 'Admin' || ch.role == 'Owner',
      isGroup: ch.chat.isGroup,
      lastMessage: ch.chat.lastMessage,
    }));
    return neededForm;
  }

  async searchGroups(keyword: string) {
    const matches = await prisma.chat.findMany({
      where: {
        name: {
          startsWith: keyword,
        },
        isGroup: true,
        OR: [
          {
            status: 'Public',
          },
          {
            status: 'Protected',
          },
        ],
      },
      select: {
        name: true,
      },
    });
    return matches;
  }
}
