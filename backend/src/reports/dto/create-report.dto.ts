import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator'
import { ReportType } from '@prisma/client'

export class CreateReportDto {

    @IsInt()
    userId: number

    @IsInt()
    spaceId: number

    @IsString()
    @IsNotEmpty()
    description: string

    @IsEnum(ReportType)
    type: ReportType
}