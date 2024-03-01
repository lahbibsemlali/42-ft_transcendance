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

  @Post('blockOrUnblock')
  blockOrUnblock(@User() user, @Body() body) {
    const {targetId, block} = body;
    this.chatService.blockOrUnblock(user.id, targetId, block);
  }

  @Get('isBlocked')
  async isBlocked(@User() user, @Query('targetId') targetId) {
    targetId = parseInt(targetId)
    return {isBlocked: await this.chatService.isBlocked(user.id, targetId)};
  }

  @Post('muteOrUnmute')
  muteOrUnmute(@User() user, @Body() body) {
    const {targetId, chatId, mute} = body;
    this.chatService.muteOrUnmute(user.id, targetId, chatId, mute);
  }

  @Post('kick')
  kick(@Body() body) {
    const {targetId, chatId, mute} = body;
    this.chatService.kick(targetId, chatId, mute);
  }

  @Post('ban')
  ban(@Body() body) {
    const {targetId, chatId, mute} = body;
    this.chatService.ban(targetId, chatId, mute);
  }


  @Get('get_chat')
  getChat(@User() user) {
    const chat = this.chatService.getChat(user.id)
    return chat
  }

  @Get('get_messages')
  getMessages(@User() user, @Query('chatId') chatId) {
    chatId = parseInt(chatId)
    const messages = this.chatService.getMessages(user.id, chatId)
    return messages
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
