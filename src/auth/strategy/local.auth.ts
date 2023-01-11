import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
      throw new BadRequestException('Invalid email');
    }
    
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
