import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { extname } from 'path';

const prisma = new PrismaClient;

@Injectable()
export class UserService {
    async loginOrRegister(userData: {username: string, imageLink: string}) {
        const user = await prisma.user.findFirst({
            where: {
              username: userData.username,
            },
        });
        if (user)
            return {id: user.id, username: user.username, status: 200}
        else {
            await prisma.user.create({
                data: {
                    username: userData.username,
                    avatar: userData.imageLink
                },
            });
            return {id: user.id, username: user.username, status: 201}
        }
    }
    async updateAvatar(userName: string, location: string) {
        const user = await prisma.user.findUnique({
            where: {
              username: userName,
            },
        });
        if (user) {
            console.log(location, userName)
            await prisma.user.update({
                where: {username: userName},
                data: {avatar: location}
            })
            return {status: 201, message: "avatar uploaded successfully"}
        }
        else {
            return {status: 404, message: "user not found"};
        }
    }
    async addFriend(userName: string, friendName: string) {
        const user = await prisma.user.findUnique({
            where: {
                username: userName
            }
        })
        const friend = await prisma.user.findUnique({
            where: {
                username: friendName
            }
        })
        if (!user || !friend)
            return {status: 404, message: "no such user or friend"}
        const exists = user.friends.includes(friendName)
        if (!exists) {
            await prisma.user.update({
                where: {
                    username: userName
                },
                data: {
                    friends: [...user.friends, friendName]
                }
            })
            return {status: 201, message: `user ${friendName} added successfully`}
        }
        else
            return {status: 400, message: `user ${friendName} already exists`}
    }
}
