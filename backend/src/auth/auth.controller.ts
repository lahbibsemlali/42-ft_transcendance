import { Body, Controller, Get, HttpCode, Post, Query, Req, Res, UploadedFile, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from 'src/user/jwt.guard';

const prisma = new PrismaClient();

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Get('/42')
  @UseGuards(AuthGuard('42'))
  log() {}

  @Get('/42_callback')
  @UseGuards(AuthGuard('42'))
  async consL(@Req() req, @Res() res) {
    const user = req.user;
    const token = await this.authService.generateJwtToken(user);
    res.cookie('jwt', token);
    res.redirect(`http://localhost:4000/`);
  }

  @Get('checkToken')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async checkToken(@Req() req: Request) {
  }
}
