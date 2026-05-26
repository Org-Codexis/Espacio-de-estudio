import { http } from './auth'

export type Report = {

    id: number

    description: string

    type: string

}

export const reportsApi = {

    list: () =>
        http<Report[]>('/reports'),

}