import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateReportDto } from './dto/create-report.dto'

@Injectable()
export class ReportsService {

    constructor(private readonly prisma: PrismaService) {}

    create(dto: CreateReportDto) {
        return this.prisma.report.create({
            data: dto,
        })
    }

    findAll() {
        return this.prisma.report.findMany({
            include: {
                user: true,
                space: true,
            },
        })
    }
}