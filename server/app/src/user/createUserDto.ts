import { IsAlphanumeric, IsEmail, IsEmpty, IsNumber, IsString, Matches } from "class-validator";

export default class createUserDto {
    @IsEmpty()
    @IsNumber()
    id: number

    @IsEmpty()
    @IsString()
    @IsAlphanumeric()
    @Matches(/^[0-9A-Za-z]{6,16}$/)
    username: string

    @IsEmail()
    email: string
}
