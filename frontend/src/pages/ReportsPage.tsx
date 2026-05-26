import {
    useMemo,
    useState,
} from 'react'

import {
    useReports,
} from '../api/reports.queries'

import {
    useDebouncedValue,
} from '../hooks/useDebouncedValue'

export default function ReportsPage() {

    const {
        data = [],
        isLoading,
        error,
    } = useReports()

    const [q, setQ] = useState('')

    const debouncedQ =
        useDebouncedValue(q)

    const filtered = useMemo(() => {

        return data.filter((r) =>

            `${r.description} ${r.type}`
                .toLowerCase()
                .includes(
                    debouncedQ.toLowerCase(),
                ),
        )

    }, [data, debouncedQ])

    return (

        <div className='space-y-4'>

            <h1 className='text-3xl font-bold'>
                Reportes
            </h1>

            <input
                value={q}
                onChange={(e) =>
                    setQ(e.target.value)
                }
                placeholder='Buscar reporte'
                className='border p-2 rounded w-full'
            />

            {isLoading && (
                <p>Cargando...</p>
            )}

            {error && (
                <p>Error cargando reportes</p>
            )}

            <div className='bg-white rounded shadow overflow-hidden'>

                <table className='w-full'>

                    <thead>

                        <tr className='border-b bg-gray-100'>

                            <th className='p-3'>
                                Descripción
                            </th>

                            <th className='p-3'>
                                Tipo
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
                                    {r.description}
                                </td>

                                <td className='p-3'>
                                    {r.type}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    )

}