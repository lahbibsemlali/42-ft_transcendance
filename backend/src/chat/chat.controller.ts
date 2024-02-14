import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from 'src/user/user.decorator';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('createGroup')
  createGroup(@User() user, @Query('id') targetId, @Body() body) {
    return this.chatService.createGroup(user.id, body.groupName);
  }

  @Get('getChat')
  getChat(@User() user) {
    const chat = this.chatService.getChat(user.id)
    return chat
  }

}
