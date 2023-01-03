import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const fs = require('fs');
const FileType = require('file-type');

import path = require('path');
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

type validFileExtension = 'mp3' | 'mp4 audio' | 'mp4';
type validMimeType = 'audio/mpeg' | 'audio/mp4' | 'video/mp4';

const validFileExtensions: validFileExtension[] = ['mp3', 'mp4 audio', 'mp4'];
const validMimeTypes: validMimeType[] = ['audio/mpeg', 'audio/mp4', 'video/mp4'];

export const saveMusicToStorage = {
  storage: diskStorage({
    destination: './file-upload/music',
    filename: (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
  limits: {
    fileSize: 52428800,
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
