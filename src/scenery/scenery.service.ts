/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scenery } from './entity/scenery.entity';

@Injectable()
export class SceneryService {
  constructor(
    @InjectRepository(Scenery) private sceneryRepository: Repository<Scenery>,
  ) {}

  async create(scenery: Object) {
    return await this.sceneryRepository
      .createQueryBuilder()
      .insert()
      .into(Scenery)
      .values(scenery)
      .execute();
  }

  async getList(page: number, perpage: number) {
    const limit = perpage;
    const offset = perpage * (page - 1);

    const query = await this.sceneryRepository
      .createQueryBuilder('scenery')
      .select('scenery')
      .where('scenery.status = :status', { status: 1 });

    const allData = await query.getMany();
    const totalRecord = allData.length;
    const data = await query.limit(limit).offset(offset).getMany();
    const totalShowed = data.length;

    return {
      page,
      totalRecord,
      totalShowed,
      totalPage: Math.ceil(totalRecord / limit),
      showing: `${totalRecord === 0 ? 0 : offset + 1} - ${
        offset + totalShowed
      } of ${totalRecord}`,
      next: offset + totalShowed !== totalRecord,
      data,
    };
  }

  async findOne(id: number) {
    return await this.sceneryRepository
      .createQueryBuilder('scenery')
      .select('scenery')
      .where('scenery.id = :id', { id })
      .andWhere('scenery.status = :status', { status: 1 })
      .getOne();
  }
}
