import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  Query,
  ParseIntPipe,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UserService } from './user.service';
import { PrismaClient } from '@prisma/client';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from './user.decorator';
import UsernameDto from './dtos/usernameDto';
import SearchDto from './dtos/searchDto';

const prisma = new PrismaClient();

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('search')
  async search(@User() user, @Query() searchDto: SearchDto) {
    return {
      matches: await this.userService.searchUser(user.id, searchDto.keyword),
    };
  }

  @UseGuards(JwtGuard)
  @Get('getFriendStatus')
  async getFriendStatus(@User() user, @Query('id', ParseIntPipe) id: number) {
    const status = await this.userService.getFriendStatus(user.id, id);
    return { status: status };
  }

  @UseGuards(JwtGuard)
  @Get('add_friend')
  async addFiend(@User() user, @Query('id', ParseIntPipe) id: number) {
    await this.userService.addFriend(user.id, id);
  }

  @UseGuards(JwtGuard)
  @Get('accept_friend')
  async acceptFriend(@User() user, @Query('id', ParseIntPipe) id: number) {
    await this.userService.acceptFriend(user.id, id);
  }

  @UseGuards(JwtGuard)
  @Get('remove_friend')
  async remove_friend(@User() user, @Query('id', ParseIntPipe) id: number) {
    await this.userService.removeFriend(user.id, id);
  }

  @UseGuards(JwtGuard)
  @Put('block')
  async block(@User() user, @Query('id', ParseIntPipe) id: number) {
    await this.userService.block(user.id, id);
  }

  @UseGuards(JwtGuard)
  @Put('unBlock')
  async unBlock(@User() user, @Query('id', ParseIntPipe) id: number) {
    await this.userService.unBlock(user.id, id);
  }

  @UseGuards(JwtGuard)
  @Post('updateAvatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const suffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
          const filename = `${suffix}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedFileTypes = ['.jpg', '.jpeg', '.png'];
        const isValidFileType = allowedFileTypes.includes(
          extname(file.originalname).toLowerCase(),
        );

        if (isValidFileType) callback(null, true);
        else callback(new BadRequestException('Invalid file type'), false);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadAvatar(@User() user, @UploadedFile() file: Express.Multer.File) {
    const fileName = `http://${process.env.VITE_DOMAIN}:8000/api/user/getAvatar/${file.filename}`;
    return await this.userService.updateAvatar(user.id, fileName);
  }

  @UseGuards(JwtGuard)
  @Get('getUserId')
  async getUserId(@User() user) {
    return { userId: user.id };
  }

  @Get('getAvatar/:filename')
  async getAvatar(@Res() res, @Param('filename') filename) {
    res.sendFile(join(__dirname, '..', '..', 'uploads', filename));
  }

  @UseGuards(JwtGuard)
  @Post('updateUsername')
  async updateUsername(@User() user, @Body() usernameDto: UsernameDto) {
    return await this.userService.updateUsername(user.id, usernameDto.username);
  }

  @UseGuards(JwtGuard)
  @Post('updateTwoFa')
  async updateTwoFa(@User() user, @Body('twoFa') twoFa) {
    return await this.userService.updateTwoFa(user.id, twoFa);
  }

  @UseGuards(JwtGuard)
  @Get('getUserData')
  async getUserData(@User() user) {
    const userInfo = await this.userService.getUserById(user.id);
    return {
      username: userInfo.username,
      isTwoFa: userInfo.twoFA,
      avatar: userInfo.avatar,
      wins: userInfo.wins,
      loses: userInfo.loses,
    };
  }

  @UseGuards(JwtGuard)
  @Get('isBlocked')
  async isBlocked(@User() user, @Query('id', ParseIntPipe) id: number) {
    await this.userService.getUserById(id);
    if (user.id == id || (await this.userService.checkBlock(user.id, id)))
      return { isBlocked: true };
    return { isBlocked: false };
  }

  @UseGuards(JwtGuard)
  @Get('getFriendProfile')
  async getFriendProfile(@User() user, @Query('id', ParseIntPipe) id: number) {
    const userInfo = await this.userService.getUserById(id);
    if (await this.userService.checkBlock(user.id, id))
      throw new BadRequestException('user is blocked by target');
    return {
      username: userInfo.username,
      state: userInfo.state,
      inGame: userInfo.inGame,
      isTwoFa: userInfo.twoFA,
      avatar: userInfo.avatar,
      wins: userInfo.wins,
      loses: userInfo.loses,
    };
  }

  @Get('getLastFive')
  @UseGuards(JwtGuard)
  async getLastFive(@User() user) {
    return { lastFive: await this.userService.getLastFive(user.id) };
  }

  @Get('getUserLastFive')
  @UseGuards(JwtGuard)
  async getUserLastFive(@Query('id') id: number) {
    return { lastFive: await this.userService.getLastFive(id) };
  }

  @UseGuards(JwtGuard)
  @Get('delete')
  async delete() {
    await { ss: prisma.profile.deleteMany() };
  }

  @Get('getUsers')
  async getUsers() {
    return await prisma.user.findMany();
  }

  @Get('getFriendList')
  @UseGuards(JwtGuard)
  async getFriendList(@User() user) {
    const friends = await this.userService.getUserFriends(user.id);
    return { friends: friends };
  }

  @Get('getBlockedFriends')
  @UseGuards(JwtGuard)
  async getBlockedFriends(@User() user) {
    const friends = await this.userService.getBlockedFriends(user.id);
    return { blocked: friends };
  }

  @Get('getFriendRequests')
  @UseGuards(JwtGuard)
  async getFriendRequests(@User() user) {
    const requests = await this.userService.getUserFriendRequests(user.id);
    return { requests: requests };
  }

  @Get('deleteAll')
  async deleteAllUsers() {
    const users = await prisma.user.deleteMany();
    return users;
  }
}
