import {
    useMemo,
    useState,
} from 'react'

import {
    useSpaces,
} from '../api/spaces.queries'

import {
    useDebouncedValue,
} from '../hooks/useDebouncedValue'

export default function SpacesPage() {

    const {
        data = [],
        isLoading,
        error,
    } = useSpaces()

    const [q, setQ] = useState('')

    const debouncedQ =
        useDebouncedValue(q)

    const filtered = useMemo(() => {

        return data.filter((s) =>

            `${s.name} ${s.location}`
                .toLowerCase()
                .includes(
                    debouncedQ.toLowerCase(),
                ),
        )

    }, [data, debouncedQ])

    return (

        <div className='space-y-4'>

            <h1 className='text-3xl font-bold'>
                Espacios
            </h1>

            <input
                value={q}
                onChange={(e) =>
                    setQ(e.target.value)
                }
                placeholder='Buscar espacio'
                className='border p-2 rounded w-full'
            />

            {isLoading && (
                <p>Cargando...</p>
            )}

            {error && (
                <p>Error cargando espacios</p>
            )}

            <div className='bg-white rounded shadow overflow-hidden'>

                <table className='w-full'>

                    <thead>

                        <tr className='border-b bg-gray-100'>

                            <th className='p-3'>
                                Nombre
                            </th>

                            <th className='p-3'>
                                Capacidad
                            </th>

                            <th className='p-3'>
                                Ubicación
                            </th>

                            <th className='p-3'>
                                Disponible
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filtered.map((s) => (

                            <tr
                                key={s.id}
                                className='border-b'
                            >

                                <td className='p-3'>
                                    {s.name}
                                </td>

                                <td className='p-3'>
                                    {s.capacity}
                                </td>

                                <td className='p-3'>
                                    {s.location}
                                </td>

                                <td className='p-3'>
                                    {s.isAvailable
                                        ? 'Sí'
                                        : 'No'}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    )

}