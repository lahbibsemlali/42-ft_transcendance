import { Body, Controller, Get, Post, Query, Req, Res, UploadedFile, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

const prisma = new PrismaClient();

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Get('/42')
  @UseGuards(AuthGuard('42'))
  log() {}

  @Get('/42_callback')
  @UseGuards(AuthGuard('42'))
  async consL(@Req() req) {
    const user = req.user;
    const token = await this.authService.generateJwtToken(user);
    console.log(user, token)
    return {token}
  }
}