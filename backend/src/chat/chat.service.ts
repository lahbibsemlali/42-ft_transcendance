import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';

const prisma = new PrismaClient;

@Injectable()
export class ChatService {
  async createGroup(userId: number, groupName: string) {
    const group = await prisma.chat.create({
      data: {
        name: groupName,
        image: join(__dirname,'group-icon-original.svg'),
        isGroup: true,
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
            name: true,
            image: true,
            isGroup: true,
            lastMessage: true
          }
        }
      }
    })
  }

}