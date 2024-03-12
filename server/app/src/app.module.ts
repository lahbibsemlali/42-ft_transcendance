import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TwoFaService } from './two-fa/two-fa.service';
import { TwoFaController } from './two-fa/two-fa.controller';
import { GameGateway } from './Game/game.Gateway';
import { GameService } from './Game/game.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TwoFaModule } from './two-fa/two-fa.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    UserModule, 
    AuthModule, 
    TwoFaModule,
    ChatModule
  ],
  providers: [GameService, GameGateway, JwtService],
})
export class AppModule {}
