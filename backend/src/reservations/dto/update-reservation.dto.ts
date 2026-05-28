import { PartialType } from '@nestjs/mapped-types'
import { CreateReservationDto } from './create-reservation.dto'
import { IsEnum, IsOptional } from 'class-validator'
import { ReservationStatus } from '@prisma/client'

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
    @IsEnum(ReservationStatus)
    @IsOptional()
    status?: ReservationStatus // 👈 Con esto habilitamos el cambio de estado limpio
}