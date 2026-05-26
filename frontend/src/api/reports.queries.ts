import { useQuery } from '@tanstack/react-query'

import { reportsApi } from './reports'

const keys = {

    all: ['reports'] as const,

}

export function useReports() {

    return useQuery({

        queryKey: keys.all,

        queryFn: reportsApi.list,

    })

}