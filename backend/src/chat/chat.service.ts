import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient;
@Injectable()
export class ChatService {
  async createDm(userId: number, targetId: number) {
    const chat = await prisma.chat.create({
      data: {
        name: 'targetName',
        image: 'url',
        users: {
          create: [
            {
              userId: userId
            },
            {
              userId: targetId
            }
          ]
        }
      }
    })
  }

  async createGroup(userId: number, groupName: string) {
    const group = await prisma.chat.create({
      data: {
        name: groupName,
        image: 'url',
        users: {
          create: [
            {
              userId: userId,
              role: 'Owner'
            }
          ]
        }
      }
    })
  }

  async getChat(userId: number) {
    const chat = await prisma.userChat.findMany({
      where: {
        userId: userId,
      },
      select: {
        chat: true
      }
    })
    return chat
  }

}
