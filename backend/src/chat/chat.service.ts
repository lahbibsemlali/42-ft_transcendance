import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import { join } from 'path';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient;

@Injectable()
export class ChatService {
  async createGroup(userId: number, groupName: string, password: string, status: any) {
    const salt = await bcrypt.genSalt()
    const hash = status == 'Protected' && password && password.length ? await bcrypt.hash(password, salt) : null
    const group = await prisma.chat.create({
      data: {
        name: groupName,
        image: join(__dirname,'group-icon-original.svg'),
        isGroup: true,
        status: status,
        password: hash
      }
    })
    await prisma.userChat.create({
      data: {
        userId: userId,
        chatId: group.id
      }
    })
  }

  async addToGroup(userId: number, targetId: number, groupId: number) {
    const group = await prisma.chat.findFirst({
      where: {
        id: groupId
      }
    })
    const userChat = await prisma.userChat.findFirst({
      where: {
        userId: userId,
        chatId: groupId
      }
    })
    if (!userChat)
      throw new UnauthorizedException('user not in group')
    if (userChat.role != 'Owner' && userChat.role != 'Admin')
      throw new UnauthorizedException('user is neither Owner or Admin in this group')
    await prisma.userChat.create({
      data: {
        userId: targetId,
        chatId: group.id
      }
    })
  }

  async joinGroup(userId: number, groupId: number, password: string) {
    const group = await prisma.chat.findFirst({
      where: {
        id: groupId
      }
    })
    if (group.status == 'Private')
      throw new UnauthorizedException('group is private')
    if (group.status == 'Protected') {
      const unhashed = bcrypt.compare(password, group.password, () => {
        throw new UnauthorizedException('wrong password to joing group')
      })
    }
    await prisma.userChat.create({
      data: {
        userId: userId,
        chatId: group.id
      }
    })
  }

  async updateLastMessage(userId: number, chatId: number, message: string) {
    const lastMessage = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        lastMessage: message
      }
    })
  }

  async createMessage(userId: number, chatId: number, content: string) {
    const message = await prisma.message.create({
      data: {
        senderId: userId,
        chatId: chatId,
        body: content,
      }
    })
  }

  async getChat(userId: number) {
    const userChat = await prisma.userChat.findMany({
      where: {
        userId: userId,
      },
      select: {
        chat: {
          select: {
            id: true,
            name: true,
            image: true,
            isGroup: true,
            lastMessage: true
          }
        }
      }
    })
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
                status: 'Public'
              },
              {
                status: 'Protected'
              }
            ]
        },
        select: {
            name: true
        }
    })
    return matches
  }
}