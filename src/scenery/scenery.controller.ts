/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
  Get,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import {
  isFileExtensionSafe,
  saveVideoToStorage,
  removeFile,
} from '../helpers/video-storage.helper';
import { SceneryService } from './scenery.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Observable, of, switchMap, map } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BadRequestException } from '@nestjs/common/exceptions';

// @UseGuards(JwtAuthGuard)
@Controller('scenery')
export class SceneryController {
  constructor(private sceneryService: SceneryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveVideoToStorage))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('theme') theme: string,
  ): Observable<any> {
    const fileName = file?.filename;

    if (!fileName) throw new BadRequestException('File must be mp4/mkv!');

    const videosFolderPath = join(process.cwd(), './file-upload/videos');
    const fullImagePath = join(videosFolderPath + '/' + file.filename);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit && theme) {
          return this.sceneryService.create({
            theme: theme,
            path: file.filename,
          });
        }
        const message = isFileLegit
          ? 'Theme is required!'
          : 'File content does not match extension!';
        removeFile(fullImagePath);
        throw new BadRequestException(message);
      }),
    );
  }

  @Get('/:page/:perPage')
  getThemes(@Param('page') page: number, @Param('perPage') perPage: number) {
    return this.sceneryService.getList(page, perPage);
  }

  @Get('/:id')
  async getTheme(@Param('id') id: number) {
    return await this.sceneryService.findOne(id)
  }
}
