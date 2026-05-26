import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'

import {
    usersApi,
    type CreateUserDto,
} from './users'

const keys = {

    all: ['users'] as const,

}

export function useUsers() {

    return useQuery({

        queryKey: keys.all,

        queryFn: usersApi.list,

    })

}

export function useCreateUser() {

    const qc = useQueryClient()

    return useMutation({

        mutationFn: (
            dto: CreateUserDto,
        ) => usersApi.create(dto),

        onSuccess: () => {

            qc.invalidateQueries({
                queryKey: keys.all,
            })

        },

    })

}