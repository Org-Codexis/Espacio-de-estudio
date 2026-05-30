import { useState } from 'react'
import { useSpaces } from '../api/spaces.queries'
import { useReservations } from '../api/reservations.queries'

interface WelcomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export default function WelcomePage({
  onNavigateToLogin,
  onNavigateToRegister,
}: WelcomePageProps) {
  const [showModal, setShowModal] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState<any>(null)

  const {

    data: spaces = [],
    isLoading,
  } = useSpaces()

  const {
    data: reservations = [],
  } = useReservations()

  const availableSpaces =
    spaces.filter(
      (space) => space.isAvailable,
    ).length

  const reservationsCount =
    reservations.length

  const activeStudents = 0

  const satisfaction = '95%'

  return (

    <div className="min-h-screen bg-[#f5f8fc] text-slate-800 flex flex-col font-sans">

      {/* NAVBAR */}

      <header className="bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-black text-blue-700">
              StudySpace
            </h1>

            <p className="text-sm text-gray-500">
              Espacios de Estudio
            </p>

          </div>

          <nav className="hidden lg:flex gap-10 text-gray-700 font-semibold">

            <a
              href="#"
              className="text-blue-600 border-b-2 border-blue-600 pb-1"
            >
              Inicio
            </a>

            <a href="#spaces" className="hover:text-blue-600">
              Espacios
            </a>

          </nav>

          <div className="flex items-center gap-3">

            <button
              onClick={onNavigateToRegister}
              className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg font-semibold transition"
            >
              Registrarse
            </button>

            <button
              onClick={onNavigateToLogin}
              className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              Iniciar sesión
            </button>

          </div>

        </div>

      </header>

      {/* HERO */}

      {showModal && ( /*esto es para la ventana emergente de ¿como funciona?*/

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[4px] px-4">

          {/* MODAL */}

          <div className="relative w-full max-w-2xl rounded-[34px] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.20)] px-12 py-10 animate-[fadeIn_.25s_ease]">

            {/* BOTÓN CERRAR */}

            <button
              onClick={() => setShowModal(false)}
              className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f5fb] text-4xl font-light text-slate-700 transition hover:bg-[#e8eef9]"
            >

              ×

            </button>

            {/* TITULO */}

            <h2 className="text-[56px] leading-none font-black tracking-tight text-[#07123f]">
              ¿Cómo funciona?
            </h2>

            <p className="mt-5 text-[22px] leading-relaxed text-[#4f5d7c]">
              Reserva espacios académicos
              de forma rápida y sencilla.
            </p>

            {/* PASOS */}

            <div className="mt-12 space-y-0">

              {/* PASO 1 */}

              <div className="flex items-start gap-6 pb-9">

                {/* NUMERO */}

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0f4cff] text-2xl font-black text-white shadow-lg">

                  1

                </div>

                {/* ICONO */}

                <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-[#edf3ff]">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-14 w-14 text-[#0f4cff]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                    />

                  </svg>

                </div>

                {/* TEXTO */}

                <div className="flex-1 pt-3">

                  <h3 className="text-[34px] font-black text-[#07123f]">

                    Explora espacios

                  </h3>

                  <p className="mt-3 text-[21px] leading-relaxed text-[#4f5d7c]">
                    Visualiza salas de estudio,
                    bibliotecas y cubículos
                    disponibles en tiempo real.
                  </p>

                </div>

              </div>

              {/* LINEA */}

              <div className="ml-[86px] border-t border-[#dfe6f5]"></div>

              {/* PASO 2 */}

              <div className="flex items-start gap-6 py-9">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0f4cff] text-2xl font-black text-white shadow-lg">

                  2

                </div>

                <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-[#edf3ff]">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-14 w-14 text-[#0f4cff]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.121 17.804A11.955 11.955 0 0112 15c2.5 0 4.847.765 6.879 2.074M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />

                  </svg>

                </div>

                <div className="flex-1 pt-3">

                  <h3 className="text-[34px] font-black text-[#07123f]">

                    Inicia sesión

                  </h3>

                  <p className="mt-3 text-[21px] leading-relaxed text-[#4f5d7c]">
                    Accede con tu cuenta institucional
                    para realizar reservas.
                  </p>

                </div>

              </div>

              {/* LINEA */}

              <div className="ml-[86px] border-t border-[#dfe6f5]"></div>

              {/* PASO 3 */}

              <div className="flex items-start gap-6 pt-9">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0f4cff] text-2xl font-black text-white shadow-lg">

                  3

                </div>

                <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-[#edf3ff]">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-14 w-14 text-[#0f4cff]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />

                  </svg>

                </div>

                <div className="flex-1 pt-3">

                  <h3 className="text-[34px] font-black text-[#07123f]">

                    Reserva fácilmente

                  </h3>

                  <p className="mt-3 text-[21px] leading-relaxed text-[#4f5d7c]">
                    Selecciona el espacio,
                    fecha y horario
                    que mejor se adapte
                    a tus necesidades.
                  </p>

                </div>

              </div>

            </div>

            {/* BOTÓN */}

            <button
              onClick={() => setShowModal(false)}
              className="mt-12 h-[78px] w-full rounded-[20px] bg-[#0f4cff] text-[30px] font-black text-white shadow-lg transition hover:bg-[#0a3ee0]"
            >
              Entendido

            </button>

          </div>

        </div>/*aqui termina la ventana emergente de ¿como funciona?*/

      )}
      {selectedSpace && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">

          <div className="bg-white w-full max-w-5xl rounded-[35px] overflow-hidden shadow-2xl relative animate-fadeIn">

            {/* BOTÓN CERRAR */}

            <button
              onClick={() => setSelectedSpace(null)}
              className="absolute top-6 right-6 bg-white/90 hover:bg-white w-12 h-12 rounded-full text-2xl text-gray-500 shadow-lg z-20"
            >

              ×

            </button>

            <div className="grid lg:grid-cols-2">

              {/* IMAGEN */}

              <div className="relative h-full">

                <img
                  src={selectedSpace.image}
                  className="h-full w-full object-cover lg:min-h-[650px]"
                />

                <div className="absolute top-6 left-6 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold shadow">

                  Disponible ahora

                </div>

              </div>

              {/* INFORMACIÓN */}

              <div className="p-10 flex flex-col justify-between">

                <div>

                  <p className="text-blue-600 font-bold uppercase tracking-widest text-sm">

                    Espacio Académico

                  </p>

                  <h2 className="text-5xl font-black text-slate-800 mt-3">

                    {selectedSpace.name}

                  </h2>

                  <p className="text-gray-500 text-lg mt-6 leading-relaxed">

                    Espacio diseñado para estudio,
                    reuniones académicas y trabajo
                    colaborativo en un ambiente moderno,
                    cómodo y silencioso.

                  </p>

                  {/* CARACTERÍSTICAS */}

                  <div className="grid grid-cols-2 gap-5 mt-10">

                    <div className="bg-[#f5f8fc] rounded-2xl p-5 border">

                      <p className="text-gray-400 text-sm">
                        Capacidad
                      </p>

                      <h3 className="text-2xl font-black text-slate-800 mt-2">

                        👥 {selectedSpace.capacity}

                      </h3>

                    </div>

                    <div className="bg-[#f5f8fc] rounded-2xl p-5 border">

                      <p className="text-gray-400 text-sm">
                        Ubicación
                      </p>

                      <h3 className="text-lg font-black text-slate-800 mt-2">

                        📍 {selectedSpace.location}

                      </h3>

                    </div>

                    <div className="bg-[#f5f8fc] rounded-2xl p-5 border">

                      <p className="text-gray-400 text-sm">
                        Horario
                      </p>

                      <h3 className="text-lg font-black text-slate-800 mt-2">

                        7:00 AM - 9:00 PM

                      </h3>

                    </div>

                    <div className="bg-[#f5f8fc] rounded-2xl p-5 border">

                      <p className="text-gray-400 text-sm">
                        Estado
                      </p>

                      <h3 className="text-lg font-black text-green-600 mt-2">

                        Disponible

                      </h3>

                    </div>

                  </div>

                  {/* BENEFICIOS */}

                  <div className="mt-10 space-y-4">

                    <div className="flex items-center gap-3">

                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>

                      <p className="text-gray-600">
                        WiFi de alta velocidad
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>

                      <p className="text-gray-600">
                        Aire acondicionado
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>

                      <p className="text-gray-600">
                        Ambiente silencioso
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>

                      <p className="text-gray-600">
                        Equipos multimedia
                      </p>

                    </div>

                  </div>

                </div>

                {/* BOTONES */}

                <div className="flex gap-4 mt-12">

                  <button
                    onClick={() => setSelectedSpace(null)}
                    className="flex-1 border border-gray-300 py-4 rounded-2xl font-bold hover:bg-gray-50 transition"
                  >

                    Cerrar

                  </button>

                  <button
                    onClick={onNavigateToLogin}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg transition"
                  >

                    Reservar espacio

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

      <main className="flex-1">

        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">

          {/* TEXTO */}

          <div className="space-y-8">

            <h1 className="text-5xl lg:text-7xl font-black leading-tight text-slate-900">

              Encuentra el espacio perfecto{' '}

              <span className="text-blue-600">
                para estudiar
              </span>

            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">

              Reserva salas de estudio,
              bibliotecas y espacios académicos
              de forma fácil, moderna y rápida.

            </p>

            <div className="flex flex-wrap gap-5">

              <a
                href="#spaces"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition inline-flex items-center"
              >

                Explorar espacios

              </a>

              <button
                onClick={() => setShowModal(true)}
                className="bg-white border border-gray-200 hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold transition"
              >

                ¿Cómo funciona?

              </button>

            </div>

          </div>

          {/* IMAGEN HERO */}

          <div className="relative">

            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1400"
              className="rounded-[40px] shadow-2xl h-[500px] object-cover w-full"
            />

            <section className="max-w-7xl mx-auto px-6 lg:px-8">

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                <div className="bg-white rounded-3xl border p-8">

                  <h2 className="text-5xl font-black text-blue-600">

                    {availableSpaces}

                  </h2>

                  <button
                    onClick={() => setSelectedSpace(spaces)}
                    className="flex-1 border py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >

                    Ver detalles

                  </button>

                </div>

              </div>

            </section>

            {/* ESTADÍSTICAS */}

            <section className="max-w-7xl mx-auto px-6 lg:px-8">

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                <div className="bg-white rounded-3xl border p-8 shadow-sm">

                  <h2 className="text-5xl font-black text-blue-600">
                    18
                  </h2>

                  <p className="text-gray-500 mt-3">
                    Espacios disponibles
                  </p>

                </div>
                <div className="bg-white rounded-3xl border p-8">

                  <h2 className="text-5xl font-black text-blue-600">

                    {reservationsCount}

                  </h2>

                  <p className="text-gray-500 mt-3">
                    Reservas hoy
                  </p>

                </div>

                <div className="bg-white rounded-3xl border p-8">

                  <h2 className="text-5xl font-black text-blue-600">

                    {activeStudents}

                  </h2>

                  <p className="text-gray-500 mt-3">
                    Estudiantes activos
                  </p>

                </div>

                <div className="bg-white rounded-3xl border p-8">

                  <h2 className="text-5xl font-black text-blue-600">

                    {satisfaction}

                  </h2>

                  <p className="text-gray-500 mt-3">
                    Satisfacción usuarios
                  </p>

                </div>

              </div>

            </section>

            {/* ESPACIOS */}

            <section
              id="spaces"
              className="max-w-7xl mx-auto px-6 lg:px-8 py-20"
              >

              <h2 className="text-4xl font-black mb-10">

                Espacios disponibles

              </h2>

              {isLoading && (

                <p>Cargando espacios...</p>

              )}

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

                {spaces.map((space) => (

                  <div
                    key={space.id}
                    className="bg-white rounded-3xl overflow-hidden border shadow-sm"
                  >

                    <img
                      src={
                        space.imageUrl ||
                        'https://via.placeholder.com/600x400'
                      }
                      className="h-56 w-full object-cover"
                    />

                    <div className="p-6">

                      <div className="flex justify-between">

                        <h3 className="text-xl font-bold">

                          {space.name}

                        </h3>

                        <span
                          className={
                            space.isAvailable
                              ? 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs'
                              : 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs'
                          }
                        >

                          {space.isAvailable
                            ? 'Disponible'
                            : 'Ocupado'}

                        </span>

                      </div>

                      <p className="mt-3 text-gray-500">

                        👥 {space.capacity}

                      </p>

                      <p className="text-gray-500">

                        📍 {space.location}

                      </p>

                      <div className="flex gap-3 mt-6">

                        <button
                          onClick={() =>
                            setSelectedSpace(space)
                          }
                          className="flex-1 border py-3 rounded-xl font-semibold"
                        >

                          Ver detalles

                        </button>

                        <button
                          onClick={onNavigateToLogin}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
                        >

                          Reservar

                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </section>

            {/* CTA FINAL */}

            <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">

              <div className="bg-white rounded-[40px] border p-12 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10">

                <div>

                  <h2 className="text-4xl font-black text-slate-800">

                    ¿Listo para reservar tu espacio?

                  </h2>

                  <p className="text-gray-500 mt-4 text-lg">

                    Inicia sesión para acceder
                    a todas las funciones del sistema.

                  </p>

                </div>

                <button
                  onClick={onNavigateToLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl text-lg font-bold transition shadow-lg"
                >

                  Iniciar sesión

                </button>

              </div>

            </section>

          </div>
          </main>

          {/* FOOTER */}

          <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-400 font-medium">

            © {new Date().getFullYear()} StudySpace —
            Universidad de Nariño

          </footer>

        </div>

      
  )

}