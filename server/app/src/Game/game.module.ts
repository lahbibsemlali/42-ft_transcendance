import { Module } from '@nestjs/common';
import { GameGateway } from './game.Gateway';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
    imports: [UserModule],
    providers: [GameGateway, UserService],
})
export class GameModule{

}