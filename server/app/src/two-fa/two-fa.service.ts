import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TwoFaService {
    constructor(private userService: UserService) {}

    async generateTwoFaSecrete(userId: number) {
        const secrete = authenticator.generateSecret();
        const username = (await this.userService.getUserById(userId)).username
        const url = authenticator.keyuri(username, process.env.TWOFA_APP_NAME, secrete)
        this.userService.setTwoFaSecrete(userId, secrete)
        return { url }
    }
    async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
        return toFileStream(stream, otpauthUrl);
    }
    async isTwoFaValid(token: string, userId: number) {
        return authenticator.verify({
            token: token,
            secret: (await this.userService.getUserById(userId)).twoFASecrete
        })
    }
    async turnTwoFaOn(userId: number) {
        this.userService.turnOnUserTwoFa(userId)
    }
}
