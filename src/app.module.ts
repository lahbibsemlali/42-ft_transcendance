import { Module } from '@nestjs/common';
import { FortyTwoStrategy } from './fortyTwo-strategy';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [FortyTwoStrategy, AuthService],
})
export class AppModule {}
