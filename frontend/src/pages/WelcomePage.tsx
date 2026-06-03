import { useState, useEffect } from "react";

interface WelcomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export default function WelcomePage({
  onNavigateToLogin,
  onNavigateToRegister,
}: WelcomePageProps) {
  const [showModal, setShowModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] =
    useState(false);
  const [showContactModal, setShowContactModal] =
    useState(false); // <-- Nuevo estado para el modal de contacto
  const [selectedSpace, setSelectedSpace] =
    useState<any>(null);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [featuredSpace, setFeaturedSpace] =
    useState<any>(null);
  const [reservasHoy, setReservasHoy] = useState<number>(0);
  const [estudiantesActivos, setEstudiantesActivos] =
    useState<number>(0);

  useEffect(() => {
    // 1. Obtener todos los espacios
    const fetchSpaces = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/spaces",
        );
        if (response.ok) {
          const data = await response.json();

          setSpaces(data);

          const availableSpaces = data.filter(
            (space: any) => space.isAvailable,
          );

          if (availableSpaces.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * availableSpaces.length,
            );

            setFeaturedSpace(availableSpaces[randomIndex]);
          } else {
            setFeaturedSpace(null);
          }
        }
      } catch (error) {
        console.error(
          "Error al conectar con el servidor (spaces):",
          error,
        );
      }
    };

    // 2. Obtener y filtrar reservas de hoy que ya estén ACEPTADAS por el administrador
    const fetchTodayReservations = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/reservations",
        );
        if (response.ok) {
          const reservas = await response.json();

          if (Array.isArray(reservas)) {
            const ahora = new Date();
            const anio = ahora.getFullYear();
            const mes = String(
              ahora.getMonth() + 1,
            ).padStart(2, "0");
            const dia = String(ahora.getDate()).padStart(
              2,
              "0",
            );
            const hoyFormateado = `${anio}-${mes}-${dia}`;

            const activasAhora = reservas.filter(
              (reserva: any) => {
                const propiedadFecha =
                  reserva.reservationDate || reserva.date;
                if (!propiedadFecha) return false;

                const fechaReservaFormateada =
                  propiedadFecha.split("T")[0];
                const esHoy =
                  fechaReservaFormateada === hoyFormateado;
                const estaAprobada =
                  reserva.status === "APPROVED" ||
                  reserva.status === "CONFIRMED" ||
                  reserva.status === "ACEPTADA";

                if (!esHoy || !estaAprobada) return false;

                if (reserva.endTime) {
                  const [horasFin, minutosFin] =
                    reserva.endTime.split(":").map(Number);
                  const horaLimite = new Date();
                  horaLimite.setHours(
                    horasFin,
                    minutosFin,
                    0,
                    0,
                  );
                  return ahora < horaLimite;
                }

                return true;
              },
            );

            setReservasHoy(activasAhora.length);
          }
        } else {
          const responseCount = await fetch(
            "http://localhost:3000/reservations/today-count",
          );
          if (responseCount.ok) {
            const data = await responseCount.json();
            setReservasHoy(
              typeof data === "number"
                ? data
                : data.count || 0,
            );
          }
        }
      } catch (error) {
        console.error(
          "Error al obtener las reservas de hoy:",
          error,
        );
      }
    };

    // 3. Obtener usuarios y filtrar estudiantes activos
    const fetchActiveStudents = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/users",
        );
        if (response.ok) {
          const usuarios = await response.json();

          if (Array.isArray(usuarios)) {
            const totalFiltrado = usuarios.filter(
              (user: any) => {
                const rolName =
                  user.role?.name ||
                  (user.roleId === 1 ? "USER" : "ADMIN");
                return (
                  (rolName === "USER" ||
                    rolName === "STUDENT") &&
                  user.isActive === true
                );
              },
            ).length;

            setEstudiantesActivos(totalFiltrado);
          }
        }
      } catch (error) {
        console.error(
          "Error fetching and filtering active students:",
          error,
        );
      }
    };

    fetchSpaces();
    fetchTodayReservations();
    fetchActiveStudents();

    const intervalo = setInterval(() => {
      fetchTodayReservations();
    }, 30000);

    return () => clearInterval(intervalo);
  }, []);

  const imagenesPredeterminadas = [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200",
  ];

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

          <nav className="hidden lg:flex gap-10 text-gray-700 font-semibold items-center">
            <a
              href="#"
              className="text-blue-600 border-b-2 border-blue-600 pb-1"
            >
              Inicio
            </a>
            <a
              href="#spaces"
              className="hover:text-blue-600"
            >
              Espacios
            </a>
            <button
              onClick={() => setShowFeaturesModal(true)}
              className="hover:text-blue-600 font-semibold transition text-left"
            >
              Características
            </button>
            {/* Se cambia el enlace por un botón con evento para abrir el modal */}
            <button
              onClick={() => setShowContactModal(true)}
              className="hover:text-blue-600 font-semibold transition text-left"
            >
              Contacto
            </button>
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

      {/* MODAL: ¿CÓMO FUNCIONA? */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[4px] px-4 py-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-[34px] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.20)] px-6 sm:px-12 py-8 sm:py-10 my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#f2f5fb] text-2xl sm:text-4xl font-light text-slate-700 transition hover:bg-[#e8eef9] z-10"
            >
              ×
            </button>
            <h2 className="text-3xl sm:text-[56px] leading-tight font-black tracking-tight text-[#07123f] pr-8">
              ¿Cómo funciona?
            </h2>
            <p className="mt-3 text-lg sm:text-[22px] leading-relaxed text-[#4f5d7c]">
              Reserva espacios académicos de forma rápida y
              sencilla.
            </p>
            <div className="mt-8 space-y-0">
              <div className="flex flex-row items-start gap-4 sm:gap-6 pb-6 sm:pb-9">
                <div className="flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#0f4cff] text-lg sm:text-2xl font-black text-white shadow-lg">
                  1
                </div>
                <div className="flex h-20 w-20 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-[22px] bg-[#edf3ff]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 sm:h-14 sm:w-14 text-[#0f4cff]"
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
                <div className="flex-1 pt-1 sm:pt-3">
                  <h3 className="text-xl sm:text-[34px] font-black text-[#07123f]">
                    Explora espacios
                  </h3>
                  <p className="mt-1 text-sm sm:text-[21px] leading-relaxed text-[#4f5d7c]">
                    Visualiza salas de estudio, bibliotecas
                    y cubículos disponibles en tiempo real.
                  </p>
                </div>
              </div>
              <div className="ml-14 sm:ml-[86px] border-t border-[#dfe6f5]"></div>
              <div className="flex flex-row items-start gap-4 sm:gap-6 py-6 sm:py-9">
                <div className="flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#0f4cff] text-lg sm:text-2xl font-black text-white shadow-lg">
                  2
                </div>
                <div className="flex h-20 w-20 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-[22px] bg-[#edf3ff]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 sm:h-14 sm:w-14 text-[#0f4cff]"
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
                <div className="flex-1 pt-1 sm:pt-3">
                  <h3 className="text-xl sm:text-[34px] font-black text-[#07123f]">
                    Inicia sesión
                  </h3>
                  <p className="mt-1 text-sm sm:text-[21px] leading-relaxed text-[#4f5d7c]">
                    Accede con tu cuenta institucional para
                    realizar reservas.
                  </p>
                </div>
              </div>
              <div className="ml-14 sm:ml-[86px] border-t border-[#dfe6f5]"></div>
              <div className="flex flex-row items-start gap-4 sm:gap-6 pt-6 sm:pt-9">
                <div className="flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#0f4cff] text-lg sm:text-2xl font-black text-white shadow-lg">
                  3
                </div>
                <div className="flex h-20 w-20 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-[22px] bg-[#edf3ff]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 sm:h-14 sm:w-14 text-[#0f4cff]"
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
                <div className="flex-1 pt-1 sm:pt-3">
                  <h3 className="text-xl sm:text-[34px] font-black text-[#07123f]">
                    Reserva fácilmente
                  </h3>
                  <p className="mt-1 text-sm sm:text-[21px] leading-relaxed text-[#4f5d7c]">
                    Selecciona el espacio, fecha y horario
                    que mejor se adapte a tus necesidades.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-8 sm:mt-12 h-14 sm:h-[78px] w-full rounded-[20px] bg-[#0f4cff] text-xl sm:text-[30px] font-black text-white shadow-lg transition hover:bg-[#0a3ee0]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CARACTERÍSTICAS */}
      {showFeaturesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[4px] px-4 py-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-[34px] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.20)] px-6 sm:px-10 py-8 sm:py-10 my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFeaturesModal(false)}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f2f5fb] text-xl font-light text-slate-700 transition hover:bg-[#e8eef9] z-10"
            >
              ×
            </button>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-xs sm:text-sm">
              Nuestra Plataforma
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-[#07123f] mt-1">
              Características
            </h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base leading-relaxed">
              Herramientas clave diseñadas para optimizar
              tus jornadas de estudio y el uso de la
              infraestructura universitaria.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-[#f5f8fc] border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl font-bold text-lg">
                  🕒
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">
                    Tiempo Real
                  </h4>
                  <p className="text-gray-500 text-xs mt-1">
                    Consulta disponibilidad exacta de salas
                    y cubículos al instante.
                  </p>
                </div>
              </div>
              <div className="bg-[#f5f8fc] border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl font-bold text-lg">
                  📅
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">
                    Reserva Flexible
                  </h4>
                  <p className="text-gray-500 text-xs mt-1">
                    Agenda tus bloques horarios con
                    anterioridad asegurando tu cupo.
                  </p>
                </div>
              </div>
              <div className="bg-[#f5f8fc] border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl font-bold text-lg">
                  🔔
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">
                    Recordatorios
                  </h4>
                  <p className="text-gray-500 text-xs mt-1">
                    Notificaciones e historial detallado
                    directo en tu cuenta.
                  </p>
                </div>
              </div>
              <div className="bg-[#f5f8fc] border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl font-bold text-lg">
                  👥
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">
                    Control de Aforos
                  </h4>
                  <p className="text-gray-500 text-xs mt-1">
                    Respeta y promueve el uso organizado de
                    los límites de cada área.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowFeaturesModal(false)}
              className="mt-6 h-12 w-full rounded-xl bg-[#0f4cff] font-bold text-white shadow-md transition hover:bg-[#0a3ee0]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* NUEVO MODAL: CONTACTO */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[4px] px-4 py-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-[34px] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.20)] px-6 sm:px-10 py-8 sm:py-10 my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f2f5fb] text-xl font-light text-slate-700 transition hover:bg-[#e8eef9] z-10"
            >
              ×
            </button>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-xs sm:text-sm">{`Soporte & Desarrollo`}</p>
            <h2 className="text-2xl sm:text-4xl font-black text-[#07123f] mt-1">
              Información de Contacto
            </h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base leading-relaxed">
              Conoce al equipo técnico y la entidad
              académica encargada del desarrollo y la
              supervisión de la plataforma StudySpace.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* DESARROLLADORES */}
              <div className="bg-[#f5f8fc] border border-gray-100 rounded-2xl p-4 flex gap-3 items-start sm:col-span-2">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl font-bold text-lg">
                  💻
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">
                    Equipo Desarrollador
                  </h4>
                  <ul className="text-gray-600 text-xs mt-1.5 space-y-1 list-disc list-inside font-medium">
                    <li>David Fernando Quiñones Carmona</li>
                    <li>Daney Gissela Estacio Garcia</li>
                    <li>Anny Lorena Torres Guerrero</li>
                  </ul>
                </div>
              </div>

              {/* CORREOS */}
              <div className="bg-[#f5f8fc] border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl font-bold text-lg">
                  ✉️
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">
                    Correos Electrónicos
                  </h4>
                  <div className="text-gray-500 text-[11px] mt-1.5 space-y-1 font-mono">
                    <p className="truncate">
                      dfqc2821@gmail.com
                    </p>
                    <p className="truncate">
                      daneygisela@udenar.edu.co
                    </p>
                  </div>
                </div>
              </div>

              {/* TELÉFONOS */}
              <div className="bg-[#f5f8fc] border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl font-bold text-lg">
                  📞
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">
                    Líneas Telefónicas
                  </h4>
                  <div className="text-gray-500 text-xs mt-1.5 space-y-0.5 font-medium">
                    <p>• 310 882 6790</p>
                    <p>• 316 274 4906</p>
                    <p>• 322 585 0827</p>
                  </div>
                </div>
              </div>

              {/* PROFESIONAL AYUDA */}
              <div className="bg-[#f5f8fc] border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl font-bold text-lg">
                  👨‍🏫
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">
                    Profesional de Ayuda
                  </h4>
                  <p className="text-gray-600 text-xs mt-1 font-semibold">
                    Jorge Rivera
                  </p>
                </div>
              </div>

              {/* ENTIDAD */}
              <div className="bg-[#f5f8fc] border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl font-bold text-lg">
                  🏛️
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">
                    Entidad Educativa
                  </h4>
                  <p className="text-gray-600 text-xs mt-1 font-semibold">
                    Universidad de Nariño
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="mt-6 h-12 w-full rounded-xl bg-[#0f4cff] font-bold text-white shadow-md transition hover:bg-[#0a3ee0]"
            >
              Cerrar Contacto
            </button>
          </div>
        </div>
      )}

      {/* MODAL: DETALLES DE ESPACIO */}
      {selectedSpace && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-[35px] overflow-hidden shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedSpace(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/90 hover:bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-full text-2xl text-gray-500 shadow-lg z-20 flex items-center justify-center"
            >
              ×
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 sm:h-80 lg:h-auto">
                <img
                  src={
                    selectedSpace.image ||
                    imagenesPredeterminadas[
                      spaces.indexOf(selectedSpace) %
                        imagenesPredeterminadas.length
                    ]
                  }
                  className="h-full w-full object-cover lg:min-h-[580px]"
                  alt="Espacio"
                />
                <div
                  className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold shadow ${
                    selectedSpace.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedSpace.isAvailable
                    ? "Disponible ahora"
                    : "Ocupado"}
                </div>
              </div>
              <div className="p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <p className="text-blue-600 font-bold uppercase tracking-widest text-xs sm:text-sm">
                    Espacio Académico
                  </p>
                  <h2 className="text-3xl sm:text-5xl font-black text-slate-800 mt-2">
                    {selectedSpace.name}
                  </h2>
                  <p className="text-gray-500 text-base mt-4 leading-relaxed">
                    Espacio diseñado para estudio, reuniones
                    académicas y trabajo colaborativo en un
                    ambiente moderno, cómodo y silencioso.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-[#f5f8fc] rounded-2xl p-4 border">
                      <p className="text-gray-400 text-xs">
                        Capacidad
                      </p>
                      <h3 className="text-xl font-black text-slate-800 mt-1">
                        👥 {selectedSpace.capacity}
                      </h3>
                    </div>
                    <div className="bg-[#f5f8fc] rounded-2xl p-4 border">
                      <p className="text-gray-400 text-xs">
                        Ubicación
                      </p>
                      <h3 className="text-base font-black text-slate-800 mt-1 truncate">
                        📍 {selectedSpace.location}
                      </h3>
                    </div>
                    <div className="bg-[#f5f8fc] rounded-2xl p-4 border">
                      <p className="text-gray-400 text-xs">
                        Horario
                      </p>
                      <h3 className="text-sm font-black text-slate-800 mt-1">
                        7:00 AM - 9:00 PM
                      </h3>
                    </div>
                    <div className="bg-[#f5f8fc] rounded-2xl p-4 border">
                      <p className="text-gray-400 text-xs">
                        Estado
                      </p>
                      <h3
                        className={`text-base font-black mt-1 ${
                          selectedSpace.isAvailable
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedSpace.isAvailable
                          ? "Disponible"
                          : "Ocupado"}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-4 mt-8">
                  <button
                    onClick={() => setSelectedSpace(null)}
                    className="flex-1 border border-gray-300 py-3 rounded-2xl font-bold text-sm hover:bg-gray-50 transition"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={onNavigateToLogin}
                    disabled={!selectedSpace.isAvailable}
                    className={`flex-1 py-3 rounded-2xl font-bold text-sm shadow-lg transition ${
                      selectedSpace.isAvailable
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {selectedSpace.isAvailable
                      ? "Reservar espacio"
                      : "No disponible"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-7xl font-black leading-tight text-slate-900">
              Encuentra el espacio perfecto{" "}
              <span className="text-blue-600">
                para estudiar
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              Reserva salas de estudio, bibliotecas y
              espacios académicos de forma fácil, moderna y
              rápida.
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

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1400"
              className="rounded-[40px] shadow-2xl h-[500px] object-cover w-full"
              alt="Main space"
            />
            <div className="absolute bottom-8 left-8 bg-white rounded-3xl shadow-2xl p-6 w-[320px] border border-gray-100">
              <h2 className="text-2xl font-black text-slate-800 mb-4 truncate">
                {featuredSpace
                  ? featuredSpace.name
                  : "No hay espacios disponibles"}
              </h2>

              <button
                onClick={() =>
                  featuredSpace &&
                  setSelectedSpace(featuredSpace)
                }
                disabled={!featuredSpace}
                className={`w-full py-3 rounded-xl font-bold transition shadow-md ${
                  featuredSpace
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {featuredSpace
                  ? "Ver detalles"
                  : "No disponible"}
              </button>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE ESTADÍSTICAS */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border p-8 shadow-sm flex flex-col justify-center items-center text-center">
              <h2 className="text-6xl font-black text-blue-600">
                {reservasHoy}
              </h2>
              <p className="text-gray-500 font-semibold mt-3">
                Reservas hoy
              </p>
            </div>

            <div className="bg-white rounded-3xl border p-8 shadow-sm flex flex-col justify-center items-center text-center">
              <h2 className="text-6xl font-black text-blue-600">
                {estudiantesActivos}
              </h2>
              <p className="text-gray-500 font-semibold mt-3">
                Estudiantes activos
              </p>
            </div>
          </div>
        </section>

        {/* LISTADO DE ESPACIOS */}
        <section
          id="spaces"
          className="max-w-7xl mx-auto px-6 lg:px-8 py-20"
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-black text-slate-800">
              Espacios disponibles
            </h2>
            <button className="text-blue-600 font-bold">
              Ver todos →
            </button>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {spaces.map((space, indice) => (
              <div
                key={space.id}
                className="bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition"
              >
                <img
                  src={
                    space.image ||
                    imagenesPredeterminadas[
                      indice %
                        imagenesPredeterminadas.length
                    ]
                  }
                  className="h-56 w-full object-cover"
                  alt={space.name}
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 truncate max-w-[150px]">
                      {space.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        space.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {space.isAvailable
                        ? "Disponible"
                        : "Ocupado"}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() =>
                        setSelectedSpace(space)
                      }
                      className="flex-1 border py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-sm"
                    >
                      Ver detalles
                    </button>
                    <button
                      onClick={onNavigateToLogin}
                      disabled={!space.isAvailable}
                      className={`flex-1 py-3 rounded-xl font-semibold transition text-sm ${
                        space.isAvailable
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {space.isAvailable
                        ? "Reserva"
                        : "No disponible"}
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
                Inicia sesión para acceder a todas las
                funciones del sistema.
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
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-400 font-medium">
        © {new Date().getFullYear()} StudySpace —
        Universidad de Nariño
      </footer>
    </div>
  );
}
