import { Response } from 'express';
export declare class TwoFaService {
    generateTwoFaSecrete(username: string): Promise<{
        url: string;
    }>;
    pipeQrCodeStream(stream: Response, otpauthUrl: string): Promise<void>;
}
