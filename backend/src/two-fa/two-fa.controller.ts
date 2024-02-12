import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { TwoFaService } from './two-fa.service';
import { Response } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFaController {
  constructor(
    private twoFaService: TwoFaService,
    private authService: AuthService,
    private userService: UserService
  ) {}
 
  @Post('generate')
  @UseGuards(JwtGuard)
  async register(@Res() response: Response, @Req() request) {
    const { url } = await this.twoFaService.generateTwoFaSecrete(request.user);
 
    return this.twoFaService.pipeQrCodeStream(response, url);
  }

  @Post('turn-on:id')
  async turnTwoFaOn(@Body() { token }, @Param('id') userId) {
    const isValid = this.twoFaService.isTwoFaValid(token, userId)
    if (!isValid)
      throw new UnauthorizedException('wrong 2fa token')
    await this.twoFaService.turnTwoFaOn(userId)
  }

  @Get('authenticate:id')
  @UseGuards(JwtGuard)
  async authenticate(@Body() { token }, @Param('id') userId, @Res() res) {
    const isValid = this.twoFaService.isTwoFaValid(token, userId)
    if (!isValid)
      throw new UnauthorizedException('Wrong 2fa token')
    const user = await this.userService.getUserById(userId)
    const payload = {id: userId, isTwoFaEnabled: user.twoFA}
    const jwtToken = this.authService.generateJwtToken(payload)
    res.cookie('jwt', jwtToken)
    res.redirect('http://localhost:4000')
  }
}