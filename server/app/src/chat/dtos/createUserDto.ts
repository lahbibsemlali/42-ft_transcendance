import { IsAlphanumeric, IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export default class CreateUserDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    @Matches(/^[0-9A-Za-z]{6,16}$/)
    username: string
}
