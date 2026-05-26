import { http } from './auth'

export type Space = {

    id: number

    name: string

    capacity: number

    location: string

    isAvailable: boolean

}

export const spacesApi = {

    list: () =>
        http<Space[]>('/spaces'),

}