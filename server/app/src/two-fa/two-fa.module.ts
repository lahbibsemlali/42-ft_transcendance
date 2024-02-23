import { Module } from '@nestjs/common';
import { TwoFaController } from './two-fa.controller';
import { TwoFaService } from './two-fa.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
    controllers: [TwoFaController],
    providers: [TwoFaService, UserService, AuthService]
})
export class TwoFaModule {}
