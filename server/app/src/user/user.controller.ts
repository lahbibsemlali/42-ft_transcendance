import { BadRequestException, Body, Controller, Get, Post, Param, Req, Res, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UserService } from './user.service';
import { PrismaClient } from '@prisma/client';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from './user.decorator';

const prisma = new PrismaClient

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtGuard)
    @Post('/add_friend')
    async addFiend(@User() user, @Query('friendId') friend) {
        const friendId = parseInt(friend)
        return this.userService.addFriend(user.id, friendId);
    }

    @UseGuards(JwtGuard)
    @Get('accept_friend')
    async acceptFriend(@User() user, @Query('friendId') friendId) {
        friendId = parseInt(friendId);
        this.userService.acceptFriend(user.id, friendId)
    }

    @UseGuards(JwtGuard)
    @Post("updateAvatar")
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
    async uploadAvatar(@User() user, @UploadedFile() file: Express.Multer.File) {
        const fileName = `http://${process.env.VITE_DOMAIN}:8000/api/user/getAvatar/${file.filename}`
        return this.userService.updateAvatar(user.id, fileName)
    }

    @UseGuards(JwtGuard)
    @Get('getUserId')
    async getUserId(@User() user) {
        return user.id;
    }

    @UseGuards(JwtGuard)
    @Get('getAvatarUrl')
    async getAvatarUrl(@User() user) {
      const avatar = await prisma.profile.findFirst({
        where: {
            userId: user.id
        },
        select: {
            avatar: true
        }
      });
      return {avatar: avatar.avatar};
    }

    @Get('getAvatar/:filename')
    async getAvatar(@Res() res, @Param('filename') filename) {
        console.log("lllll")
        res.sendFile(join(__dirname, "..", "..", "uploads", filename))
    }

    @UseGuards(JwtGuard)
    @Post('updateUsername')
    async updateUsername(@User() user, @Body('username') username) {
        return this.userService.updateUsername(user.id, username);
    }

    @UseGuards(JwtGuard)
    @Get('getUsername')
    async getUsername(@User() user) {
        const userInfo = await this.userService.getUserById(user.id);
        return {username: userInfo.username};
    }
}