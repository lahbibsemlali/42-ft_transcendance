import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFaService {
    async generateTwoFaSecrete(username: string) {
        const secrete = authenticator.generateSecret();
        const url = authenticator.keyuri(username, process.env.TWOFA_APP_NAME, secrete)
        return { url }
    }
    public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
        return toFileStream(stream, otpauthUrl);
    }
}
