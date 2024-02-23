import { Response } from 'express';
import { UserService } from 'src/user/user.service';
export declare class TwoFaService {
    private userService;
    constructor(userService: UserService);
    generateTwoFaSecrete(userId: number): Promise<{
        url: string;
    }>;
    pipeQrCodeStream(stream: Response, otpauthUrl: string): Promise<void>;
    isTwoFaValid(token: string, userId: number): Promise<boolean>;
    turnTwoFaOn(userId: number): Promise<void>;
}
