import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import passport from 'passport';
import { Profile, Strategy } from 'passport-42';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { Any } from 'typeorm';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.INTRA_UID,
            clientSecret: process.env.INTRA_SECRETE,
            callbackURL: 'http://localhost:3000/auth/login',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function) {
        const user: {username: string} = profile
        const info = this.authService.createUser(user)
        done(null, info)
    }
}
