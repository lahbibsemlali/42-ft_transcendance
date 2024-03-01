import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRETE,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getUserById(payload.id)
    console.log(user.twoFA, '======', payload)
    if (!user.twoFA)
      return payload
    if (user.twoFA && payload.isTwoFaEnabled)
      return payload
  }
}
