import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator'

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

    @IsInt()
    @Min(1)
    peopleCount: number

}