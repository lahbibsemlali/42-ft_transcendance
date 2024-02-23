import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from 'src/user/user.decorator';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create_group')
  createGroup(@User() user, @Body() body) {
    const {name, password, status} = body;
    this.chatService.createGroup(user.id, name, password, status);
  }

  @Get('get_chat')
  getChat(@User() user) {
    const chat = this.chatService.getChat(user.id)
    return chat
  }

  @Get('add_to_group')
  addToGroup(@User() user, @Query('targetId') targetId, @Query('groupId') groupId) {
    this.chatService.addToGroup(user.id, targetId, groupId)
  }

  @Get('join_group')
  joinGroup(@User() user, @Query('id') groupId, @Query('password') password) {
    this.chatService.joinGroup(user.id, groupId, password)
  }
}
