import { IsDateString, IsInt, IsNotEmpty, IsString, } from 'class-validator'

export class CreateReservationDto {

    @IsInt()
    userId: number

    @IsInt()
    spaceId: number

    @IsDateString()
    reservationDate: Date

    @IsString()
    @IsNotEmpty()
    startTime: string

    @IsString()
    @IsNotEmpty()
    endTime: string

}