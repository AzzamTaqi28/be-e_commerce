import { IsString,IsEmail, Min, Length } from "class-validator";

export class CreateUserDTO {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @Length(6, 20)
    name: string;

    @IsString()
    @Length(6)
    password: string;

}