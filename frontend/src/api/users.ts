import { http } from './auth'

export type User = {

    id: number

    fullName: string

    email: string

    isActive: boolean

    roleId: number

}

export type CreateUserDto = {

    fullName: string

    email: string

    password: string

    roleId: number

}

export const usersApi = {

    list: () =>
        http<User[]>('/users'),

    create: (
        dto: CreateUserDto,
    ) =>
        http<User>(
            '/users',
            {
                method: 'POST',
                body: JSON.stringify(dto),
            },
        ),

}