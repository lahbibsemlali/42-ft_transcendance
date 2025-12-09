import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';

const prisma = new PrismaClient
@Injectable()
export class AuthService {
    async generateJwtToken(payload: any, isTwoFa = false) {
        payload.isTwoFaAuthenticated = isTwoFa;
        const token = jwt.sign(payload, process.env.JWT_SECRETE, {expiresIn: "1h"})
        return token;
    }

    async signup(signupDto: SignupDto) {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: signupDto.email }
        });

        if (existingUser) {
            throw new UnauthorizedException('Email already exists');
        }

        // Check if username is taken
        const existingProfile = await prisma.profile.findUnique({
            where: { username: signupDto.username }
        });

        if (existingProfile) {
            throw new UnauthorizedException('Username already taken');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(signupDto.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: signupDto.email,
                password: hashedPassword,
            }
        });

        // Create profile with default avatar
        const profile = await prisma.profile.create({
            data: {
                userId: user.id,
                username: signupDto.username,
                email: signupDto.email,
                avatar: 'https://cdn.intra.42.fr/users/default.png', // default avatar
            }
        });

        return { userId: user.id, email: user.email, username: profile.username };
    }

    async login(loginDto: LoginDto) {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: loginDto.email },
            include: { profile: true }
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return { 
            id: user.id, 
            email: user.email, 
            username: user.profile?.username,
            twoFA: user.profile?.twoFA || false
        };
    }
}
