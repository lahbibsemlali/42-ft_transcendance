import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { FortyTwoStrategy } from './auth/strategies/fortyTwo-strategy';
import { JwtStrategy } from './user/jwt.strategy';

@Module({
  imports: [],
  controllers: [AuthController, UserController],
  providers: [FortyTwoStrategy, JwtStrategy, AuthService, UserService],
})
export class AppModule {}
