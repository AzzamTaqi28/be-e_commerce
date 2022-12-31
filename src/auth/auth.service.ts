/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new NotFoundException('Could not find the user');
    }

    const compare = await bcrypt.compare(pass, user.password);


    if (!compare) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }

  async login(user: any) {
    
    const payload = await this.usersService.findOne(user.email);

    return {
      access_token: this.jwtService.sign({
       ...payload
      }),
    };
  }

  async register(user: any) {
    return await this.usersService.create(user);
  }
}
