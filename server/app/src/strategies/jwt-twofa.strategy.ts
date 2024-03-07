import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtTwoFaStrategy extends PassportStrategy(Strategy, 'jwt-twofa') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.handshake?.headers?.cookie?.split(';')
            .find((cookie) => cookie.trim().startsWith('jwt='))
            ?.split('=')[1];
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRETE,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getUserById(payload.id)
    if (user.twoFA && !payload.isTwoFaEnabled)
      return payload
  }
}
