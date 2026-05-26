type Props = {

    current: string

    onChange: (
        page: string,
    ) => void

}

export default function SidebarMenu({
    current,
    onChange,
}: Props) {

    return (

        <aside className='w-64 bg-gray-900 text-white min-h-screen p-5'>

            <h1 className='text-2xl font-bold mb-8'>
                Espacios
            </h1>

            <nav className='flex flex-col gap-4'>

                <button
                    onClick={() =>
                        onChange('users')
                    }
                    className={
                        current === 'users'
                            ? 'font-bold'
                            : ''
                    }
                >
                    Usuarios
                </button>

                <button
                    onClick={() =>
                        onChange('spaces')
                    }
                    className={
                        current === 'spaces'
                            ? 'font-bold'
                            : ''
                    }
                >
                    Espacios
                </button>

                <button
                    onClick={() =>
                        onChange('reservations')
                    }
                    className={
                        current === 'reservations'
                            ? 'font-bold'
                            : ''
                    }
                >
                    Reservas
                </button>

                <button
                    onClick={() =>
                        onChange('reports')
                    }
                    className={
                        current === 'reports'
                            ? 'font-bold'
                            : ''
                    }
                >
                    Reportes
                </button>

            </nav>

        </aside>

    )

}