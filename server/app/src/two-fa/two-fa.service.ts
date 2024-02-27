import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { totp, authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TwoFaService {
    constructor(private userService: UserService) {}

    async generateTwoFaSecrete(userId: string) {
        const secrete = authenticator.generateSecret();
        
        const username = (await this.userService.getUserById(userId)).username
        const url = totp.keyuri(username, process.env.TWOFA_APP_NAME, secrete)
        this.userService.setTwoFaSecrete(userId, secrete)
        return url
    }

    async isTwoFaValid(token: string, userId: string) {
        return totp.verify({
            token: token,
            secret: (await this.userService.getUserById(userId)).twoFASecrete
        })
    }
    async turnTwoFaOn(userId: string) {
        this.userService.turnOnUserTwoFa(userId)
    }
}
