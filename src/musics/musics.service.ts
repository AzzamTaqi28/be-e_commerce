/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Musics } from './entity/musics.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { removeFile } from 'src/helpers/music-storage.helper';
import { join } from 'path';

@Injectable()
export class MusicsService {
  constructor(
    @InjectRepository(Musics) private musicRepository: Repository<Musics>,
    private usersService: UsersService,
  ) {}

  async create(music: Object, userId: number) {
    const user = await this.usersService.findById(userId);

    const newMusic = await this.musicRepository.create({
      ...music,
      user,
    });
    const savedMusic = await this.musicRepository.save(newMusic);
    delete savedMusic.user.password;
    return savedMusic;
  }

  async getList(
    userId: number,
    artist: string,
    genre: string,
    page: number,
    perpage: number,
    filter: string,
  ): Promise<Object> {
    const limit = perpage;
    const offset = perpage * (page - 1);
    const query = await this.musicRepository
      .createQueryBuilder('musics')
      .where('musics.createdBy = :userId', { userId })
      .orWhere('musics.byAdmin = :byAdmin', { byAdmin: 1 });

    if (filter) {
      query.andWhere(
        'musics.title LIKE :filter OR musics.artist LIKE :filter OR musics.genre LIKE :filter',
        { filter: `%${filter}%` },
      );
    }

    if (artist) {
      query.andWhere('musics.artist = :artist', { artist });
    }

    if (genre) {
      query.andWhere('musics.genre = :genre', { genre });
    }

    query.orderBy('musics.created_at', 'DESC');

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

  async getPlaylistById(userId: number, id: number) {
    return await this.musicRepository
      .createQueryBuilder('musics')
      .where('musics.id = :id', { id })
      .andWhere('musics.createdBy = :userId', { userId })
      .orWhere('musics.byAdmin = :byAdmin', { byAdmin: true })
      .getOne();
  }

  async updatePlaylist(userId: number, id: number, music: Object) {
    const user = await this.usersService.findById(userId);
    const updatedMusic = await this.musicRepository.update(id, {
      ...music,
      user,
    });
    return updatedMusic;
  }

  async deletePlaylist(userId: number, id: number) {
    const music = await this.musicRepository
      .createQueryBuilder('musics')
      .where('musics.id = :id', { id })
      .andWhere('musics.createdBy = :userId', { userId })
      .andWhere('musics.byAdmin = :byAdmin', { byAdmin: false })
      .getOne();
    const musicFolderPath = join(process.cwd(), './file-upload/music');
    const fullImagePath = join(musicFolderPath + '/' + music.path);
    
    const deletedMusic = await this.musicRepository.delete(id);
    removeFile(fullImagePath);
    
    return deletedMusic;
  }
}
