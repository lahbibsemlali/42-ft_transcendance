export declare class AuthService {
    generateJwtToken(payload: any, isTwoFa?: boolean): Promise<string>;
}
