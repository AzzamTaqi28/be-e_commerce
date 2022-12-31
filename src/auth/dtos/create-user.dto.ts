import { IsString,IsEmail } from "class-validator";

export class CreateUserDTO {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsString()
    password: string;

}