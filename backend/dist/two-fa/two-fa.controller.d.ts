import { TwoFaService } from './two-fa.service';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
export declare class TwoFaController {
    private twoFaService;
    private authService;
    private userService;
    constructor(twoFaService: TwoFaService, authService: AuthService, userService: UserService);
    register(response: Response, request: any): Promise<void>;
    turnTwoFaOn({ token }: {
        token: any;
    }, userId: any): Promise<void>;
    authenticate({ token }: {
        token: any;
    }, userId: any, res: any): Promise<void>;
}
