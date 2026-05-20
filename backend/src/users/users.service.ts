import { Injectable, NotFoundException, } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(dto: CreateUserDto) {

        return this.prisma.user.create({

            data: {

                fullName: dto.fullName,

                email: dto.email,

                password: dto.password,

                roleId: dto.roleId,

            },

        })

    }

    async findAll() {

        return this.prisma.user.findMany({

            orderBy: {
                id: 'asc',
            },

            include: {
                role: true,
            },

        })

    }

    async findOne(id: number) {

        const user = await this.prisma.user.findUnique({

            where: { id },

            include: {
                role: true,
            },

        })

        if (!user) {
            throw new NotFoundException(
                `User ${id} no existe`,
            )
        }

        return user

    }

    async update(
        id: number,
        dto: UpdateUserDto,
    ) {

        await this.findOne(id)

        return this.prisma.user.update({

            where: { id },

            data: dto,

        })

    }

    async remove(id: number) {

        await this.findOne(id)

        await this.prisma.user.delete({

            where: { id },

        })

    }

}