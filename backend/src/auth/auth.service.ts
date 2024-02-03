import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as jwt from "jsonwebtoken";

const prisma = new PrismaClient
@Injectable()
export class AuthService {
    async generateJwtToken(payload: any) {
        const token = jwt.sign(payload, process.env.JWT_SECRETE, {expiresIn: "1h"})
        return token;
    }
}
