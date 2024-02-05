import { ClassSerializerInterceptor, Controller, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { TwoFaService } from './two-fa.service';
import { JwtGuard } from 'src/user/jwt.guard';
import { Response } from 'express';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFaController {
  constructor(
    private readonly twoFaService: TwoFaService,
  ) {}
 
  @Post('generate')
  @UseGuards(JwtGuard)
  async register(@Res() response: Response, @Req() request) {
    const { url } = await this.twoFaService.generateTwoFaSecrete(request.user);
 
    return this.twoFaService.pipeQrCodeStream(response, url);
  }
}