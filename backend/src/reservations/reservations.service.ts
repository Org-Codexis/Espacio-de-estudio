import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReservationDto) {
    // 1. Obtener fecha actual sin hora para comparar correctamente
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. CORRECCIÓN: Contar solo reservas futuras o de hoy
    const activeReservations = await this.prisma.reservation.count({
      where: {
        userId: dto.userId,
        status: {
          in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
        },
        // IMPORTANTE: Agregamos esta condición de fecha
        reservationDate: {
          gte: today,
        },
      },
    });

    if (activeReservations >= 3) {
      throw new BadRequestException(
        'El usuario ya tiene el máximo de 3 reservas activas vigentes',
      );
    }

    // ... el resto de tu código sigue igual, no lo toques ...
    const existingReservation = await this.prisma.reservation.findFirst({
      where: {
        spaceId: dto.spaceId,
        reservationDate: dto.reservationDate,
        AND: [
          { startTime: { lt: dto.endTime } },
          { endTime: { gt: dto.startTime } },
        ],
      },
    });

    const space = await this.prisma.space.findUnique({
      where: {
        id: dto.spaceId,
      },
    });

    if (!space) {
      throw new NotFoundException(`Space ${dto.spaceId} no existe`);
    }

    if (dto.peopleCount < Math.ceil(space.capacity / 2)) {
      throw new BadRequestException(
        'La cantidad de personas es muy baja para esta sala',
      );
    }

    return this.prisma.reservation.create({
      data: {
        userId: dto.userId,

        spaceId: dto.spaceId,

        reservationDate: dto.reservationDate,

        startTime: dto.startTime,

        endTime: dto.endTime,

        peopleCount: dto.peopleCount,

        status: ReservationStatus.PENDING,
      },

      include: {
        user: true,
        space: true,
      },
    });
  }

  async cancel(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation ${id} no existe`);
    }

    if (reservation.status === ReservationStatus.CANCELED) {
      throw new BadRequestException('La reserva ya fue cancelada');
    }

    // fecha actual
    const now = new Date();

    // fecha de inicio de reserva
    const reservationStart = new Date(reservation.startTime);

    //diferencia en minutos
    const diffMinutes =
      (reservationStart.getTime() - now.getTime()) / 1000 / 60;

    // si faltan menos de 60 min
    if (diffMinutes < 60) {
      await this.prisma.user.update({
        where: {
          id: reservation.userId,
        },

        data: {
          lateCancellations: {
            increment: 1,
          },
        },
      });
    }

    return this.prisma.reservation.update({
      where: { id },

      data: {
        status: ReservationStatus.CANCELED,
      },
    });
  }

  async findAll() {
    return this.prisma.reservation.findMany({
      include: {
        user: true,
        space: true,
      },

      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },

      include: {
        user: true,
        space: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation ${id} no existe`);
    }

    return reservation;
  }

  async update(id: number, dto: UpdateReservationDto) {
    await this.findOne(id);

    return this.prisma.reservation.update({
      where: { id },

      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.reservation.delete({
      where: { id },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.reservation.findMany({
      where: { userId },
      include: {
        space: true,
        user: true,
      },
      orderBy: {
        reservationDate: 'desc',
      },
    });
  }
}
