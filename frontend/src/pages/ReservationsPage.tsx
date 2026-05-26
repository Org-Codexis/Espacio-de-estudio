import {
    useMemo,
    useState,
} from 'react'

import {
    useReservations,
} from '../api/reservations.queries'

import {
    useDebouncedValue,
} from '../hooks/useDebouncedValue'

export default function ReservationsPage() {

    const {
        data = [],
        isLoading,
        error,
    } = useReservations()

    const [q, setQ] = useState('')

    const debouncedQ =
        useDebouncedValue(q)

    const filtered = useMemo(() => {

        return data.filter((r) =>

            `${r.status}`
                .toLowerCase()
                .includes(
                    debouncedQ.toLowerCase(),
                ),
        )

    }, [data, debouncedQ])

    return (

        <div className='space-y-4'>

            <h1 className='text-3xl font-bold'>
                Reservas
            </h1>

            <input
                value={q}
                onChange={(e) =>
                    setQ(e.target.value)
                }
                placeholder='Buscar estado'
                className='border p-2 rounded w-full'
            />

            {isLoading && (
                <p>Cargando...</p>
            )}

            {error && (
                <p>Error cargando reservas</p>
            )}

            <div className='bg-white rounded shadow overflow-hidden'>

                <table className='w-full'>

                    <thead>

                        <tr className='border-b bg-gray-100'>

                            <th className='p-3'>
                                Fecha
                            </th>

                            <th className='p-3'>
                                Inicio
                            </th>

                            <th className='p-3'>
                                Fin
                            </th>

                            <th className='p-3'>
                                Estado
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filtered.map((r) => (

                            <tr
                                key={r.id}
                                className='border-b'
                            >

                                <td className='p-3'>
                                    {r.reservationDate}
                                </td>

                                <td className='p-3'>
                                    {r.startTime}
                                </td>

                                <td className='p-3'>
                                    {r.endTime}
                                </td>

                                <td className='p-3'>
                                    {r.status}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    )

}