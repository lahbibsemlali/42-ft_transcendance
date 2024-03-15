import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TwoFaService } from './two-fa.service';
import { Response } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.decorator';
import * as qrcode from 'qrcode';
import { JwtTwoFaGuard } from 'src/guards/jwt-twofa.guard';
import TokenDto from './dtos/TokenDto';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFaController {
  constructor(
    private twoFaService: TwoFaService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('generate')
  async register(@Res() res: Response, @User() user) {
    const url = await this.twoFaService.generateTwoFaSecrete(user.id);

    qrcode.toDataURL(url, (err, qrUrl) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return { qrUrl: 'error' };
      }
      res.send({
        qrUrl: qrUrl,
      });
    });
  }

  @UseGuards(JwtGuard)
  @Post('turn-on')
  async turnTwoFaOn(@Body() body: TokenDto, @User() user) {
    const isValid = await this.twoFaService.isTwoFaValid(body.token, user.id);
    if (!isValid) throw new UnauthorizedException('wrong 2fa token');
    await this.twoFaService.turnTwoFaOn(user.id);
  }

  @UseGuards(JwtTwoFaGuard)
  @Post('authenticate')
  async authenticate(@Body() body: TokenDto, @User() user) {
    const isValid = await this.twoFaService.isTwoFaValid(body.token, user.id);
    if (!isValid) throw new UnauthorizedException('Wrong 2fa token');
    const payload = {
      id: user.id,
      isTwoFaEnabled: true,
    };
    const jwtToken = await this.authService.generateJwtToken(payload);
    return { jwtToken: jwtToken };
  }
}
