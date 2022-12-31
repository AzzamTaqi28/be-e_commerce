/*
https://docs.nestjs.com/providers#services
*/

import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async create(user: User) {
    const userCheck = await this.findOne(user.email);

    if (userCheck) {
      if (userCheck.email === user.email) {
        throw new BadRequestException('Email already Used');
      }
    }

    const saltOrRounds = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);

    const newUser = await this.usersRepository.create({
      ...user,
      password: hashedPassword,
    });

    const insertedUser = await this.usersRepository.insert(newUser);


    return {
      createdUser: newUser,
      message: 'User created successfully',
      access_token: this.jwtService.sign({
        ...newUser,
      }),
    };
  }
}
