import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';

import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateSpaceDto,
    @Request() req: any,
  ) {
    console.log('Usuario autenticado:', req.user);

    return this.spacesService.create(dto);
  }

  @Get()
  async findAll() {
    return this.spacesService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.spacesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateSpaceDto,

    @Request() req: any,
  ) {
    console.log('Usuario autenticado:', req.user);

    return this.spacesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe)
    id: number,

    @Request() req: any,
  ) {
    console.log('Usuario autenticado:', req.user);

    await this.spacesService.remove(id);
  }
}