import { BadRequestException, Body, Controller, Get, Post, Param, Req, Res, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from './user.service';
import { PrismaClient } from '@prisma/client';
import { JwtGuard } from './jwt.guard';

const prisma = new PrismaClient
// @UseGuards(guards)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/add_friend')
    async addFiend(@Body() body: {user: string, friend: string}) {
        return this.userService.addFriend(body.user, body.friend);
    }

    @Get('test')
    async test() {
        console.log(process.env.USER, process.env.USER, process.env.LOGNAME, process.env.USERNAME)
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
    @UseGuards(JwtGuard)
    async deleteAllUsers() {
        const users = await prisma.user.deleteMany();
        return users
    }
}
