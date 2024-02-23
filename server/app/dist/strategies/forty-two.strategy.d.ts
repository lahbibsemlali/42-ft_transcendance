import { Profile, Strategy } from 'passport-42';
import { UserService } from 'src/user/user.service';
declare const FortyTwoStrategy_base: new (...args: any[]) => Strategy;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: Function): void;
}
export {};
