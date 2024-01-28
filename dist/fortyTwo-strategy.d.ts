import { Profile, Strategy } from 'passport-42';
import { AuthService } from './auth/auth.service';
declare const FortyTwoStrategy_base: new (...args: any[]) => Strategy;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: Function): Promise<void>;
}
export {};
