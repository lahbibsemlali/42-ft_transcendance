import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { FortyTwoStrategy } from 'src/strategies/forty-two.strategy';

@Module({
    controllers: [AuthController],
    providers: [FortyTwoStrategy, AuthService, UserService]
})
export class AuthModule {}
