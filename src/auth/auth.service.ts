import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient
@Injectable()
export class AuthService {
    async createUser(userData: {username: string}) {
        const user = await prisma.user.findFirst({
            where: {
              username: userData.username,
            },
          });
          if (user) {
              return {username: user.username, exists: true}
          }
          else {
              const newUser = await prisma.user.create({
                  data: {
                      username: userData.username,
                  },
              });
              return {username: newUser.username, exists: false};
          }
    }
}
