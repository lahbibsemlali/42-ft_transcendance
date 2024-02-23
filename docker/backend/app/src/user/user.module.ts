import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
    controllers: [UserController],
    providers: [UserService, JwtStrategy],
    exports: [UserService]
})
export class UserModule {}
