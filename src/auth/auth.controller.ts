/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateUserDTO } from './dtos/create-user.dto';
import { LoginDTO } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService ) {}

    @Post('register')
    async register(@Body() createUser: CreateUserDTO) {
        return await this.authService.register(createUser);
    }

    @UseGuards(LocalGuard)
    @Post('login')
    async login(@Body() loginDTO: LoginDTO) {
        return await this.authService.login(loginDTO);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@CurrentUser() user) {
        return user;
    }
}
