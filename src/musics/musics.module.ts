import { MusicsService } from './musics.service';
import { MusicsController } from './musics.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Musics } from './entity/musics.entity';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [TypeOrmModule.forFeature([Musics,]), UsersModule],
  controllers: [MusicsController],
  providers: [MusicsService],
})
export class MusicsModule {}
