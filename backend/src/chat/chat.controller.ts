import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from 'src/user/user.decorator';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('createDm:id')
  createDm(@Req() req, @Param('id') targetId) {
    const user = req.user
    return this.chatService.createDm(user.id, targetId);
  }

  @Post('createGroup:id')
  createGroup(@Req() req, @Param('id') targetId, @Body() body) {
    const user = req.user
    return this.chatService.createGroup(user.id, body.groupName);
  }

  @Get('getChat')
  getChat(@User() user) {
    const chat = this.chatService.getChat(user.id)
  }

}
