import { Controller, Get, Param, Post, Req } from '@nestjs/common';

@Controller('Game')
export class GameController {
  @Get('/')
  RunGame(): string {
    return 'GAME PAGE';
  }

  @Post(':username')
  GetState(@Param('username') username: string): string {
    return username;
  }

  // @Post('/GameState')
  // GetState(@Req() req: Request): string {
  //     console.log(req.body);
  //     return 'POST CALLED'
  // }
}
