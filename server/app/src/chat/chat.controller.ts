import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from 'src/user/user.decorator';
import SearchDto from 'src/user/dtos/searchDto';
import IdDto from './dtos/idDto';
import BodyDto from './dtos/bodyDto';
import PasswordDto from './dtos/passwordDto';
import TargetDto from './dtos/TargetDto';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('search')
  async search(@User() user, @Query() searchDto: SearchDto) {
    const matches = await this.chatService.searchGroups(user.id, searchDto.keyword);
    return {matches: matches}
  }

  @Post('create_group')
  createGroup(@User() user, @Body() body: BodyDto) {
    this.chatService.createGroup(user.id, body.name, body.password, body.status);
  }

  @Delete('remove_group')
  removeGroup(@User() user, @Query('groupId', ParseIntPipe) groupId: number) {
    this.chatService.removeGroup(user.id, groupId);
  }

  @Post('change_password')
  changePass(
    @User() user,
    @Query('groupId', ParseIntPipe) groupId,
    @Body() body: PasswordDto,
  ) {
    this.chatService.changePass(user.id, groupId, body.password);
  }

  @Delete('remove_password')
  removePass(@User() user, @Query('groupId', ParseIntPipe) groupId) {
    this.chatService.removePass(user.id, groupId);
  }

  @Post('blockOrUnblock')
  blockOrUnblock(@User() user, @Body('block', ParseBoolPipe) block, @Query('targetId', ParseIntPipe) targetId) {
    this.chatService.blockOrUnblock(user.id, targetId, block);
  }

  @Get('isBlocked')
  async isBlocked(@User() user, @Query('targetId', ParseIntPipe) targetId) {
    return { isBlocked: await this.chatService.isBlocked(user.id, targetId) };
  }

  @Post('mute')
  muteOrUnmute(@User() user, @Body() body: IdDto) {
    const { targetId, chatId } = body;
    this.chatService.mute(user.id, targetId, chatId);
  }

  @Post('kick')
  kick(@User() user, @Body() body: IdDto) {
    const { targetId, chatId } = body;
    this.chatService.kick(user.id, targetId, chatId);
  }

  @Post('ban')
  async ban(@Body() body: IdDto) {
    const { targetId, chatId } = body;
    await this.chatService.ban(targetId, chatId);
  }

  @Post('promote')
  async promote(@User() user, @Body() body: IdDto) {
    const { targetId, chatId } = body;
    await this.chatService.promote(user.id, targetId, chatId);
  }

  @Post('denote')
  async denote(@User() user, @Body() body: IdDto) {
    const { targetId, chatId } = body;
    await this.chatService.denote(user.id, targetId, chatId);
  }

  @Get('get_chat')
  getChat(@User() user) {
    const chat = this.chatService.getChat(user.id);
    return chat;
  }

  @Get('get_messages')
  getMessages(@User() user, @Query('chatId', ParseIntPipe) chatId) {
    const messages = this.chatService.getMessages(user.id, chatId);
    return messages;
  }

  @Get('get_user_role')
  async getUserRole(@Query('userId', ParseIntPipe) userId, @Query('groupId', ParseIntPipe) groupId) {
    const role = await this.chatService.getUserRoleInChat(userId, groupId)
    return {isAdmin: role == null ? 4 : role == 'Owner' ? 0 : role == 'Admin' ? 1 : 2}
  }

  @Post('add_to_group')
  async addToGroup(
    @User() user,
    @Query('groupId', ParseIntPipe) groupId: number,
    @Body() body: TargetDto,
  ) {
      await this.chatService.addToGroup(user.id, body.target, groupId);
  }

  @Get('leave_group')
  async leaveGroup(@User() user, @Query('groupId', ParseIntPipe) groupId) {
    await this.chatService.leaveGroup(user.id, groupId);
  }

  @Get('join_group')
  async joinGroup(@User() user, @Query('id', ParseIntPipe) groupId, @Query('password') password) {
    await this.chatService.joinGroup(user.id, groupId, password);
  }
}



