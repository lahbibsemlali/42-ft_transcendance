import { Body, Controller, Get, HttpCode, Post, Query, Req, Res, UploadedFile, UseGuards } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';


const prisma = new PrismaClient();

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Post('/signup')
  @HttpCode(201)
  async signup(@Body() signupDto: SignupDto, @Res() res) {
    const user = await this.authService.signup(signupDto);
    const token = await this.authService.generateJwtToken({ id: user.userId });
    res.cookie('jwt', token);
    return res.json({ success: true, message: 'User created successfully', user });
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const user = await this.authService.login(loginDto);
    const token = await this.authService.generateJwtToken({ id: user.id });
    res.cookie('jwt', token);
    
    // Check if user has 2FA enabled
    if (user.twoFA) {
      return res.json({ success: true, requiresTwoFa: true });
    }
    
    return res.json({ success: true, user });
  }

  @Get('checkToken')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async checkToken(@Req() req: Request) {
  }
}
