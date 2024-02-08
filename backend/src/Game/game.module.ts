import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameGateway } from './game.Gateway';

@Module({
    controllers: [GameController],
    providers: [GameGateway],
})
export class GameModule{

}