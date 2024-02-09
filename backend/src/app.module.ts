import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TwoFaService } from './two-fa/two-fa.service';
import { TwoFaController } from './two-fa/two-fa.controller';
import { GameGateway } from './Game/game.Gateway';
import { GameService } from './Game/game.service';
import { JwtModule } from '@nestjs/jwt';
import { TwoFaModule } from './two-fa/two-fa.module';

@Module({
  imports: [
    UserModule, 
    AuthModule, 
    TwoFaModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRETE,
        signOptions: {
          expiresIn: `${process.env.JWT_EXPIRE_TIME}s`
        },
      })
    })
  ],
  providers: [GameService, GameGateway],
})
export class AppModule {}
