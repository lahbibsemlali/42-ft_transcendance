import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { fortyTwoAuthGuard } from 'src/guards/forty-two-auth.guard';

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
    res.cookie('jwt', token);
    if (payload.isTwoFaEnabled)
      res.redirect('http://localhost:4000/2auth')
    res.redirect(`http://localhost:4000/`);
  }
}
