import { Body, Controller, Get, HttpCode, Post, Query, Req, Res, UploadedFile, UseGuards } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { fortyTwoAuthGuard } from 'src/guards/forty-two-auth.guard';
import { JwtGuard } from 'src/guards/jwt.guard';


const prisma = new PrismaClient();

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Get('/42')
  @UseGuards(fortyTwoAuthGuard)
  log() {}

  @Get('/42_callback')
  @UseGuards(fortyTwoAuthGuard)
  async consL(@Req() req, @Res() res) {
    const payload = req.user;
    const token = await this.authService.generateJwtToken(payload);
    const user = await this.userService.getUserById(payload.id);
    res.cookie('jwt', token);
    if (payload.firstTime)
      return res.redirect(`http://${process.env.VITE_DOMAIN}:8000/settings`);
    if (user.twoFA)
      return res.redirect(`http://${process.env.VITE_DOMAIN}:8000/auth`);
    return res.redirect(`http://${process.env.VITE_DOMAIN}:8000/`);
  }

  @Get('checkToken')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async checkToken(@Req() req: Request) {
  }
}
