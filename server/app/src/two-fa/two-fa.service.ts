import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { totp, authenticator } from 'otplib';
import { encode } from 'punycode';
import * as qrcode from 'qrcode';
import { UserService } from 'src/user/user.service';
import * as OTPAuth from 'otpauth';

@Injectable()
export class TwoFaService {
  constructor(private userService: UserService) {}

  async generateTwoFaSecrete(userId: number) {
    const secrete = authenticator.generateSecret();
    const username = (await this.userService.getUserById(userId)).username;
    if (!username)
      return
    let totp = new OTPAuth.TOTP({
      issuer: process.env.TWOFA_APP_NAME,
      label: username,
      algorithm: 'SHA1',
      digits: 6,
      secret: secrete,
    });
    const url = totp.toString();
    await this.userService.setTwoFaSecrete(userId, secrete);
    return url;
  }

  async isTwoFaValid(token: string, userId: number) {
    const user = await this.userService.getUserById(userId);
    const secrete = user.twoFASecrete;
    let totp = new OTPAuth.TOTP({
      issuer: process.env.TWOFA_APP_NAME,
      label: user.username,
      algorithm: 'SHA1',
      digits: 6,
      secret: secrete,
    });
    const isValid = totp.validate({ token: token }) != null;
    return isValid;
  }

  async turnTwoFaOn(userId: number) {
    await this.userService.turnOnUserTwoFa(userId);
  }
}
