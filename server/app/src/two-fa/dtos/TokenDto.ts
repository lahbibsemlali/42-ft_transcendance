import { IsAlphanumeric, IsDefined, IsEmail, IsEmpty, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsString, Length, Matches, MaxLength, MinLength, Validator, maxLength } from "class-validator";

export default class TokenDto {
    @IsNotEmpty()
    @IsNumberString({}, {message: ' Token must contain only numeric characters'})
    @Length(6, 6, {message: ' Token must be exactly 6 characters long '})
    token: string
}
