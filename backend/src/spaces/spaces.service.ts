import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSpaceDto) {
    return this.prisma.space.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.space.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const space = await this.prisma.space.findUnique({
      where: { id },

      include: {
        reservations: true,
        reports: true,
      },
    });

    if (!space) {
      throw new NotFoundException(`Space ${id} no existe`);
    }

    return space;
  }

  async update(id: number, dto: UpdateSpaceDto) {
    await this.findOne(id);

    return this.prisma.space.update({
      where: { id },

      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.space.delete({
      where: { id },
    });
  }
}
