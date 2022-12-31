import { IsString, IsEmail } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
