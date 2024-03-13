import { IsAlphanumeric, IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength, maxLength } from "class-validator";

export default class SearchDto {
    @IsNotEmpty()
    @IsString()
    keyword: string
}
