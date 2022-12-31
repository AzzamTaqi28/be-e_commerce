import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.auth';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.auth';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '7d' },
    }),
    PassportModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
