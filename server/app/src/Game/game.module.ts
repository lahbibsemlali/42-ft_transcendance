import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameGateway } from './game.Gateway';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
    imports: [UserModule, ChatModule],
    controllers: [GameController],
    providers: [GameGateway, UserService],
})
export class GameModule{

}