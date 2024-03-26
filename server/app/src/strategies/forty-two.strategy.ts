import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-42';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.INTRA_UID,
      clientSecret: process.env.INTRA_SECRETE,
      callbackURL: `http://${process.env.VITE_DOMAIN}:8000/api/auth/42_callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    const user = {
      id: profile.id,
      username: profile.username,
      email: profile._json.email,
      imageLink: profile._json.image.link,
    };
    const info = await this.userService.loginOrRegister(user);
    done(null, info);
  }
}
