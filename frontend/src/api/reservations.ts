import { http } from './auth'

export type Reservation = {

    id: number

    reservationDate: string

    startTime: string

    endTime: string

    status: string

}

export const reservationsApi = {

    list: () =>
        http<Reservation[]>(
            '/reservations',
        ),

}