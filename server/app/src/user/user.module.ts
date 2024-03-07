import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { JwtTwoFaStrategy } from 'src/strategies/jwt-twofa.strategy';

@Module({
    controllers: [UserController],
    providers: [UserService, JwtStrategy, JwtTwoFaStrategy],
    exports: [UserService]
})
export class UserModule {}
