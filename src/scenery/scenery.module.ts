import { SceneryService } from './scenery.service';
import { SceneryController } from './scenery.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scenery } from './entity/scenery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scenery])],
  controllers: [SceneryController],
  providers: [SceneryService],
})
export class SceneryModule {}
