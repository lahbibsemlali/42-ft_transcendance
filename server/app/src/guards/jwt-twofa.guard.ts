import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtTwoFaGuard extends AuthGuard('jwt-twofa') {}
