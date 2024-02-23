import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class fortyTwoAuthGuard extends AuthGuard('42') {}