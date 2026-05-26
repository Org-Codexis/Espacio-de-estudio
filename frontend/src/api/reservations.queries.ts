import { useQuery } from '@tanstack/react-query'

import {
    reservationsApi,
} from './reservations'

const keys = {

    all: ['reservations'] as const,

}

export function useReservations() {

    return useQuery({

        queryKey: keys.all,

        queryFn:
            reservationsApi.list,

    })

}