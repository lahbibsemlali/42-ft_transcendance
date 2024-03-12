import {IsDefined, IsInt, IsNotEmpty, IsNumber, IsNumberString} from "class-validator";

export default class IdDto {
    @IsDefined()
    @IsInt()
    id: number
}
