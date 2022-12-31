import { IsOptional, IsString } from 'class-validator';

export class UpdateMusicDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  artist: string;
  
  @IsString()
  @IsOptional()
  genre: string;
}
