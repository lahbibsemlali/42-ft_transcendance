import { BadRequestException, Body, Controller, Get, Post, Param, Req, Res, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from './user.service';
import { PrismaClient } from '@prisma/client';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from './user.decorator';

const prisma = new PrismaClient
// @UseGuards(guards)
@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/add_friend')
    async addFiend(@User() user, @Query() friend) {
        return this.userService.addFriend(user.id, friend);
    }

    @Get('accept_friend')
    async acceptFriend(@User() user, @Query('friendId') friendId) {
        this.userService.acceptFriend(user.id, friendId)
    }

    @Post("upload_avatar/:username")
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const suffix = Date.now() + '_' + Math.round(Math.random() * 1e9)
                const filename = `${suffix}${extname(file.originalname)}`
                callback(null, filename)
            }
        }),
        fileFilter:(req, file, callback) => {
            const allowedFileTypes = ['.jpg', '.jpeg', '.png'];
            const isValidFileType = allowedFileTypes.includes(extname(file.originalname).toLowerCase());
            
            if (isValidFileType)
                callback(null, true);
            else
                callback(new BadRequestException('Invalid file type'), false);
        },
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    }))
    async uploadAvatar(@Param('username') userName: string, @UploadedFile() file: Express.Multer.File) {
        if (!userName)
            return "errrror"
            console.log(file, userName)
        return this.userService.updateAvatar(userName, file.filename)
    }

    @Get('getUsers')
    async me() {
      const users = await prisma.user.findMany();
      return users;
    }
    
    @Get('deleteAll')
    async deleteAllUsers() {
        const users = await prisma.user.deleteMany();
        return users
    }
}
