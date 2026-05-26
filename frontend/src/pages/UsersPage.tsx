import {
    useMemo,
    useState,
} from 'react'

import {
    useUsers,
} from '../api/users.queries'

import {
    useDebouncedValue,
} from '../hooks/useDebouncedValue'

export default function UsersPage() {

    const {
        data = [],
        isLoading,
        error,
    } = useUsers()

    const [q, setQ] = useState('')

    const debouncedQ =
        useDebouncedValue(q)

    const filtered = useMemo(() => {

        return data.filter((u) =>

            `${u.fullName} ${u.email}`
                .toLowerCase()
                .includes(
                    debouncedQ.toLowerCase(),
                ),
        )

    }, [data, debouncedQ])

    return (

        <div className='space-y-4'>

            <h1 className='text-3xl font-bold'>
                Usuarios
            </h1>

            <input
                value={q}
                onChange={(e) =>
                    setQ(e.target.value)
                }
                placeholder='Buscar usuario'
                className='border p-2 rounded w-full'
            />

            {isLoading && (
                <p>Cargando...</p>
            )}

            {error && (
                <p>Error cargando usuarios</p>
            )}

            <div className='bg-white rounded shadow'>

                <table className='w-full'>

                    <thead>

                        <tr className='border-b'>

                            <th className='p-3'>
                                Nombre
                            </th>

                            <th className='p-3'>
                                Email
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filtered.map((u) => (

                            <tr
                                key={u.id}
                                className='border-b'
                            >

                                <td className='p-3'>
                                    {u.fullName}
                                </td>

                                <td className='p-3'>
                                    {u.email}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    )

}