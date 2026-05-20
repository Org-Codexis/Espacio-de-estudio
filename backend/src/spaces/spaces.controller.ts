import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, } from '@nestjs/common'
import { SpacesService } from './spaces.service'
import { CreateSpaceDto } from './dto/create-space.dto'
import { UpdateSpaceDto } from './dto/update-space.dto'

@Controller('spaces')
export class SpacesController {

    constructor(
        private readonly spacesService: SpacesService,
    ) { }

    @Post()
    async create(
        @Body() dto: CreateSpaceDto,
    ) {

        return this.spacesService.create(dto)

    }

    @Get()
    async findAll() {

        return this.spacesService.findAll()

    }

    @Get(':id')
    async findOne(

        @Param('id', ParseIntPipe)
        id: number,

    ) {

        return this.spacesService.findOne(id)

    }

    @Patch(':id')
    async update(

        @Param('id', ParseIntPipe)
        id: number,

        @Body()
        dto: UpdateSpaceDto,

    ) {

        return this.spacesService.update(
            id,
            dto,
        )

    }

    @Delete(':id')
    @HttpCode(204)
    async remove(

        @Param('id', ParseIntPipe)
        id: number,

    ) {

        await this.spacesService.remove(id)

    }

}