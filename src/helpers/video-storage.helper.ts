import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const fs = require('fs');
const FileType = require('file-type');

import path = require('path');
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

type validFileExtension = 'mp4' | 'mkv';
type validMimeType = 'video/mp4' | 'video/x-matroska';

const validFileExtensions: validFileExtension[] = ['mp4', 'mkv'];
const validMimeTypes: validMimeType[] = ['video/mp4', 'video/x-matroska'];

export const saveVideoToStorage = {
  storage: diskStorage({
    destination: './file-upload/videos',
    filename: (req, file, cb) => {
      const split = file.originalname.split('.');
      const splitLength = split.length;
      const fileExtension: string = split[splitLength - 1];
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};

export const isFileExtensionSafe = (
  fullFilePath: string,
): Observable<boolean> => {
  return from(FileType.fromFile(fullFilePath)).pipe(
    switchMap(
      (fileExtensionAndMimeType: {
        ext: validFileExtension;
        mime: validMimeType;
      }) => {
        if (!fileExtensionAndMimeType) return of(false);

        const isFileTypeLegit = validFileExtensions.includes(
          fileExtensionAndMimeType.ext,
        );
        const isMimeTypeLegit = validMimeTypes.includes(
          fileExtensionAndMimeType.mime,
        );
        const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
        return of(isFileLegit);
      },
    ),
  );
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (err) {
    console.error(err);
  }
};
