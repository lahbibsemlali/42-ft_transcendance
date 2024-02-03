import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './strategies/fortyTwo-strategy';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Module({
    controllers: [AuthController],
    providers: [FortyTwoStrategy, AuthService, UserService]
})
export class AuthModule {}
