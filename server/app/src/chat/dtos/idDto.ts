import {IsDefined, IsInt, IsNotEmpty, IsNumber, IsNumberString} from "class-validator";

export default class IdDto {
    @IsDefined()
    @IsInt()
    targetId: number

    @IsDefined()
    @IsInt()
    chatId: number
}
