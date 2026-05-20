import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, } from '@nestjs/common'
import { ReservationsService } from './reservations.service'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { UpdateReservationDto } from './dto/update-reservation.dto'

@Controller('reservations')
export class ReservationsController {

    constructor(
        private readonly reservationsService: ReservationsService,
        private readonly service: ReservationsService,
    ) { }

    @Post()
    async create(
        @Body() dto: CreateReservationDto,
    ) {

        return this.reservationsService.create(dto)

    }

    @Get()
    async findAll() {

        return this.reservationsService.findAll()

    }

    @Get('user/:id')
    findByUser(@Param('id', ParseIntPipe) id: number) {
        return this.service.findByUser(id)
    }

    @Patch(':id')
    async update(

        @Param('id', ParseIntPipe)
        id: number,

        @Body()
        dto: UpdateReservationDto,

    ) {


        return this.reservationsService.update(
            id,
            dto,
        )

    }

    @Patch(':id/cancel')
    async cancel(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.service.cancel(id)
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(

        @Param('id', ParseIntPipe)
        id: number,

    ) {

        await this.reservationsService.remove(id)

    }

}