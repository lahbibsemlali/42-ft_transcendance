import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TwoFaService } from './two-fa/two-fa.service';
import { TwoFaController } from './two-fa/two-fa.controller';
import { GameGateway } from './Game/game.Gateway';
import { GameService } from './Game/game.service';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [TwoFaController],
  providers: [TwoFaService, GameService, GameGateway],
})
export class AppModule {}
