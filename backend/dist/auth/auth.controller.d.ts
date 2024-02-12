import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
export declare class AuthController {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UserService);
    log(): void;
    consL(req: any, res: any): Promise<void>;
    checkToken(req: Request): Promise<void>;
}
