import { IsDefined, IsNotEmpty, IsNumber, IsString } from "class-validator";

export default class BodyDto {
    @IsDefined()
    @IsNumber()
    status: number

    @IsNotEmpty()
    @IsString()
    name: string

    @IsString()
    password: string
}
