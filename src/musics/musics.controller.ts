/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  BadRequestException,
  Controller,
  Body,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MusicsService } from './musics.service';
import { FileInterceptor } from '@nestjs/platform-express';
import path, { join } from 'path';
import { Observable, switchMap } from 'rxjs';
import {
  saveMusicToStorage,
  isFileExtensionSafe,
  removeFile,
} from 'src/helpers/music-storage.helper';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Delete, Get, Param, Patch, Query, Res } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { UpdateMusicDTO } from './dtos/updatemusic.dto';

@UseGuards(JwtAuthGuard)
@Controller('musics')
export class MusicsController {
  constructor(private musicService: MusicsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveMusicToStorage))
  uploadMusic(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('genre') genre: string,
    @Body('artist') artist: string,
    @CurrentUser() user: any,
  ): Observable<any> {
    const fileName = file?.filename;

    if (!fileName) throw new BadRequestException('File must be mp3!');
    const musicFolderPath = join(process.cwd(), './file-upload/music');
    const fullImagePath = join(musicFolderPath + '/' + file.filename);
    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit && title && genre && artist) {
          return this.musicService.create(
            {
              title: title,
              genre: genre,
              artist: artist,
              path: file.filename,
            },
            user.userId,
          );
        }

        const message = isFileLegit
          ? 'All fields are required!'
          : 'File content does not match extension!';
        removeFile(fullImagePath);
        throw new BadRequestException(message);
      }),
    );
  }

  @Get('/:page/:perPage')
  getPlaylist(
    @CurrentUser() user: any,
    @Param('page', ParseIntPipe) page: number,
    @Param('perPage', ParseIntPipe) perPage: number,
    @Query('filter') filter: string,
    @Query('artist') artist: string,
    @Query('genre') genre: string,
  ): Promise<Object> {
    return this.musicService.getList(
      user.userId,
      artist,
      genre,
      page,
      perPage,
      filter,
    );
  }

  @Get('/:id')
  async getPlaylistById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return await this.musicService.getPlaylistById(user.userId, id);
  }

  @Patch('/:id')
  async updatePlaylist(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() updateMusicDto: UpdateMusicDTO,
  ) {
    return await this.musicService.updatePlaylist(
      user.userId,
      id,
      updateMusicDto,
    );
  }

  @Delete('/:id')
  async deletePlaylist(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return await this.musicService.deletePlaylist(user.userId, id);
  }
}
