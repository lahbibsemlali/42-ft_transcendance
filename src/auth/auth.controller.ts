import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth.service';

const prisma = new PrismaClient();

@Controller("auth")
export class AuthController {

  constructor(private authService: AuthService) {}

  @Get('/42')
  @UseGuards(AuthGuard('42'))
  cons() {}

  @Get('/login')
  @UseGuards(AuthGuard('42'))
  consL(@Req() req, @Res() res) {
    const user = req.user;
    console.log("heeeerere")

    if (user.exists)
      res.redirect('http://localhost:3000/auth/dashbord')
    res.redirect('http://localhost:3000/auth/complete')
  }

  @Get('complete')
  @UseGuards(AuthGuard('42'))
  async completeInfo() {
    console.log("here is where you complete you login")
    return "here is where you complete you login"
  }

  @Get('dashbord')
  @UseGuards(AuthGuard('42'))
  async dashbord() {
    console.log("this is dashbord___")
    return "you are in dashbord"
  }

  @Post("log")
  async login(@Body() data: {username:string, password: string}) {
    const user = await prisma.user.findUnique({
        where: {
            username: data.username,
        }
    })
    if (!user) {
        return "Invalid credentials"
    }
    return user
  }

  @Get('users')
  async me() {
    const users = await prisma.user.findMany();

    return users;
  }
  
  @Get('deleteAll')
  async deleteAllUsers() {
      const users = await prisma.user.deleteMany();
      return users
  }
}