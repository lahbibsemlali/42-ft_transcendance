import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

const prisma = new PrismaClient();

@Injectable()
export class ChatService {
  constructor(private userService: UserService) {}

  async checkGroupPermissions(userId: number, chatId: number, admin: boolean) {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
      },
    });

    if (!chat) return false;

    const userChat = await prisma.userChat.findFirst({
      where: {
        chatId: chatId,
        userId: userId,
      },
      select: {
        role: true,
      },
    });

    if (!userChat) return false;
    if (userChat.role == 'Admin' && !admin) return false;
    if (userChat.role == 'User') return false;
    return true;
  }

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
    await this.userService.getUserById(targetId);
    if (block) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          blocked: {
            connect: [{ id: targetId }],
          },
        },
      });
      await prisma.user.update({
        where: {
          id: targetId,
        },
        data: {
          blockedBy: {
            connect: [{ id: userId }],
          },
        },
      });
    } else {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          blocked: {
            disconnect: [{ id: targetId }],
          },
        },
      });
      await prisma.user.update({
        where: {
          id: targetId,
        },
        data: {
          blockedBy: {
            disconnect: [{ id: userId }],
          },
        },
      });
    }
  }

  async mute(userId: number, targetId: number, chatId: number) {
    await this.userService.getUserById(targetId);
    if (this.checkGroupPermissions(userId, chatId, true)) {
      await prisma.userChat.update({
        where: {
          userId_chatId: {
            userId: targetId,
            chatId: chatId,
          },
        },
        data: {
          isMutted: true,
        },
      });
      setTimeout(async () => {
        await prisma.userChat.update({
          where: {
            userId_chatId: {
              userId: targetId,
              chatId: chatId,
            },
          },
          data: {
            isMutted: false,
          },
        });
      }, 86400000);
    }
  }

  async kick(userId: number, targetId: number, chatId: number) {
    await this.userService.getUserById(targetId);
    if (targetId == userId)
      throw new BadRequestException('cant kick your self');
    if (this.checkGroupPermissions(userId, chatId, true)) {
      const chat = await prisma.userChat.delete({
        where: {
          userId_chatId: {
            userId: targetId,
            chatId: chatId,
          },
        },
      });
    }
  }

  async ban(userId: number, targetId: number, chatId: number) {
    await this.userService.getUserById(targetId);
    if (this.checkGroupPermissions(userId, chatId, true)) {
      const userChat = await prisma.userChat.findFirst({
        where: {
          userId: targetId
        }
      })
      if (!userChat)
        return
      await prisma.userChat.delete({
        where: {
          userId_chatId: {
            userId: targetId,
            chatId: chatId,
          },
        },
      });
    }
  }

  async promote(userId: number, targetId: number, chatId: number) {
    await this.userService.getUserById(targetId);
    if (this.checkGroupPermissions(userId, chatId, false)) {
      const targetChat = await prisma.userChat.findFirst({
        where: {
          userId: targetId,
          chatId: chatId,
        },
      });

      if (!targetChat) throw new UnauthorizedException('target not in group');

      await prisma.userChat.update({
        where: {
          userId_chatId: {
            userId: targetId,
            chatId: chatId,
          },
        },
        data: {
          role: 'Admin',
        },
      });
    }
  }

  async denote(userId: number, targetId: number, chatId: number) {
    await this.userService.getUserById(targetId);
    if (this.checkGroupPermissions(userId, chatId, false)) {
      const targetChat = await prisma.userChat.findFirst({
        where: {
          userId: targetId,
          chatId: chatId,
        },
      });

      if (!targetChat) throw new UnauthorizedException('target not in group');

      await prisma.userChat.update({
        where: {
          userId_chatId: {
            userId: targetId,
            chatId: chatId,
          },
        },
        data: {
          role: 'User',
        },
      });
    }
  }

  async getUserByUsername(username: string) {
    const user = await prisma.profile.findFirst({
      where: {
        username: username,
      },
    });
    if (!user) throw new UnauthorizedException('no such user');
    return user;
  }

  async addToGroup(userId: number, target: string, groupId: number) {
    const user = await this.getUserByUsername(target);
    const targetId = user.userId;

    if (this.checkGroupPermissions(userId, groupId, true)) {
      const friendChat = await prisma.userChat.findFirst({
        where: {
          userId: targetId,
          chatId: groupId,
        },
      });
      if (friendChat) throw new BadRequestException('user already in group');
      await prisma.userChat.create({
        data: {
          userId: targetId,
          chatId: groupId,
        },
      });
    }
  }

  async leaveGroup(userId: number, groupId: number) {
    const group = await prisma.chat.findFirst({
      where: {
        id: groupId,
      },
    });
    if (!group) throw new BadRequestException('no such group');
    const userChat = await prisma.userChat.findFirst({
      where: {
        userId: userId,
        chatId: groupId,
      },
    });
    if (userChat) {
      await prisma.userChat.delete({
        where: {
          userId_chatId: {
            userId: userId,
            chatId: groupId,
          },
        },
      });
    }
  }

  async joinGroup(userId: number, groupId: number, password: string) {
    const group = await prisma.chat.findFirst({
      where: {
        id: groupId,
      },
    });
    if (!group) return;
    if (group.status == 'Private')
      throw new UnauthorizedException('group is private');
    if (group.status == 'Protected') {
      if (!password || !password.length) return;
      const match = await bcrypt.compare(password, group.password);
      if (!match)
        throw new UnauthorizedException('wrong password to joing group');
    }
    await prisma.userChat.create({
      data: {
        userId: userId,
        chatId: group.id,
      },
    });
  }

  async removeGroup(userId: number, groupId: number) {
    if (this.checkGroupPermissions(userId, groupId, false)) {
      await prisma.chat.delete({
        where: {
          id: groupId,
        },
      });
    }
  }

  async changePass(userId: number, groupId: number, password: string) {
    const userChat = await prisma.userChat.findFirst({
      where: {
        userId: userId,
        chatId: groupId,
      },
    });
    if (!userChat) throw new UnauthorizedException('user not in group');
    if (userChat.role != 'Owner')
      throw new UnauthorizedException(
        'user is neither Owner or Admin in this group',
      );
    const group = await prisma.chat.findFirst({
      where: {
        id: groupId,
      },
    });
    if (!group || group.status != 'Protected' || !password || !password.length)
      throw new BadRequestException('something wrong');
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    await prisma.chat.update({
      where: {
        id: groupId,
      },
      data: {
        password: hash,
      },
    });
  }

  async removePass(userId: number, groupId: number) {
    const userChat = await prisma.userChat.findFirst({
      where: {
        userId: userId,
        chatId: groupId,
      },
    });
    if (!userChat) throw new UnauthorizedException('user not in group');

    if (this.checkGroupPermissions(userId, groupId, true)) {
      await prisma.chat.update({
        where: {
          id: groupId,
        },
        data: {
          status: 'Public',
          password: null,
        },
      });
    }
  }

  async createMessage(userId: number, chatId: number, content: string) {
    if (content && content.length) {
      const userChat = await prisma.userChat.findFirst({
        where: {
          userId: userId,
          chatId: chatId,
        },
        select: {
          isMutted: true,
          chat: {
            select: {
              isGroup: true,
            },
          },
        },
      });

      const chat = await prisma.userChat.findMany({
        where: {
          chatId: chatId,
        },
        select: {
          isMutted: true,
          chat: {
            select: {
              isGroup: true,
            },
          },
          userId: true,
        },
      });
      if (!userChat || !chat) return;
      const isBlocked =
        (!chat[0].chat.isGroup &&
          ((await this.isBlocked(chat[0].userId, chat[1].userId)) ||
            (await this.hasBlocked(chat[0].userId, chat[1].userId)))) ||
        userChat.isMutted;
      if (!isBlocked) {
        await prisma.message.create({
          data: {
            senderId: userId,
            chatId: chatId,
            body: content,
          },
        });
      }
    }
  }
  async isBlocked(f1Id: number, f2Id: number) {
    if (f1Id == f2Id) return false;
    const user = await prisma.user.findFirst({
      where: {
        id: f1Id,
      },
      select: {
        blocked: {
          select: {
            id: true,
          },
        },
      },
    });
    return user.blocked.map((b) => b.id).includes(f2Id);
  }

  async hasBlocked(f1Id: number, f2Id: number) {
    if (f1Id == f2Id) return false;
    const user = await prisma.user.findFirst({
      where: {
        id: f1Id,
      },
      select: {
        blockedBy: {
          select: {
            id: true,
          },
        },
      },
    });
    return user.blockedBy.map((b) => b.id).includes(f2Id);
  }

  async getMessages(userId: number, chatId: number) {
    const messages = await prisma.message.findMany({
      where: {
        chatId: chatId,
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
    if (!messages) return;
    const filteredMessages = await Promise.all(
      messages.map(async (message) => {
        const isBlocked = await this.isBlocked(
          userId,
          message.sender.profile.userId,
        );
        const hasBlocked = await this.hasBlocked(
          userId,
          message.sender.profile.userId,
        );
        return !isBlocked && !hasBlocked ? message : null;
      }),
    );

    const neededForm = filteredMessages
      .filter((message) => message !== null)
      .map((message) => ({
        isMe: message.sender.profile.userId === userId,
        userId: message.sender.profile.userId,
        avatar: message.sender.profile.avatar,
        content: message.body,
      }));
    return neededForm;
  }

  async getUserState(userId: number, chatId: number) {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        isGroup: false,
      },
      select: {
        users: {
          select: {
            userId: true,
            user: {
              select: {
                profile: {
                  select: {
                    state: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (chat)
      return chat.users.filter((user) => user.userId != userId)[0].user.profile
        .state;
    return 0;
  }

  async getChat(userId: number) {
    const chat = await prisma.userChat.findMany({
      where: {
        userId: userId,
        isBanned: false,
      },
      select: {
        chat: {
          select: {
            id: true,
            name: true,
            image: true,
            status: true,
            isGroup: true,
            lastMessage: true,
            users: { select: { userId: true } },
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
    if (!chat) return;
    const neededForm = Promise.all(
      await chat.map(async (ch) => ({
        id: ch.chat.id,
        userId: !ch.chat.isGroup ? ch.chat.users.filter((user) => user.userId != userId)[0].userId : 0,
        name: ch.chat.isGroup ? ch.chat.name : ch.dmName,
        image: ch.chat.isGroup ? ch.chat.image : ch.dmImage,
        state: await this.getUserState(userId, ch.chat.id),
        isProtected: ch.chat.status == 'Protected',
        isAdmin: ch.role == 'Admin' || ch.role == 'Owner',
        isOwner: ch.role == 'Owner',
        isGroup: ch.chat.isGroup,
        lastMessage: ch.chat.lastMessage,
      })),
    );
    return neededForm;
  }

  async getUserRoleInChat(userId: number, chatId: number) {
    const chat = await prisma.userChat.findFirst({
      where: {
        userId: userId,
        chatId: chatId,
      },
      select: {
        role: true,
        isBanned: true,
      },
    });
    if (!chat || chat.isBanned) return null;
    return chat.role;
  }

  async searchGroups(userId: number, keyword: string) {
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
        users: {
          select: {
            userId: true,
          },
        },
        id: true,
        name: true,
        status: true,
      },
    });
    if (!matches) return;
    let filtered = matches.filter((m) => {
      const is = m.users.some((user) => user.userId === userId);
      return !is;
    });
    const jsonF = filtered.map((match) => ({
      id: match.id,
      name: match.name,
      isProtected: match.status == 'Protected',
    }));
    return jsonF;
  }
}
