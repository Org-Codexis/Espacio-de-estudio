import { useQuery } from '@tanstack/react-query'

import { spacesApi } from './spaces'

const keys = {

    all: ['spaces'] as const,

}

export function useSpaces() {

    return useQuery({

        queryKey: keys.all,

        queryFn: spacesApi.list,

    })

}