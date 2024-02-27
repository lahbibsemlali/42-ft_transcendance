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
    async addFiend(@User() user, @Query('friendId') friendId) {
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

    @Get('getAvatar/:filename')
    async getAvatar(@Res() res, @Param('filename') filename) {
        console.log("lllll")
        res.sendFile(join(__dirname, "..", "..", "uploads", filename))
    }

    @UseGuards(JwtGuard)
    @Post('updateUsername')
    async updateUsername(@User() user, @Body('username') username) {
        console.log(username)
        return this.userService.updateUsername(user.id, username);
    }

    @UseGuards(JwtGuard)
    @Post('updateTwoFa')
    async updateTwoFa(@User() user, @Body('twoFa') twoFa) {
        console.log(twoFa)
        return this.userService.updateTwoFa(user.id, twoFa);
    }

    @UseGuards(JwtGuard)
    @Get('getUserData')
    async getUserData(@User() user) {
        const userInfo = await this.userService.getUserById(user.id);
        return {
            username: userInfo.username,
            isTwoFa: userInfo.twoFA,
            avatar: userInfo.avatar
        };
    }
    
    @Get('delete')
    async delete() {
        await {ss: prisma.profile.deleteMany()};
    }
}