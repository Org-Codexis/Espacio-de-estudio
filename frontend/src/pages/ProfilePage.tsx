// src/pages/ProfilePage.tsx

interface ProfilePageProps {
  user: {
    id: number;
    fullName?: string;
    name?: string;
    nombre?: string;
    username?: string;
    email: string;
    lateCancellations?: number; // Mapeado desde PostgreSQL
  };
}

export default function ProfilePage({ user }: ProfilePageProps) {
  // Mapeo seguro del nombre para mantener consistencia con la barra lateral
  const displayName = 
    user?.fullName || 
    user?.name || 
    user?.nombre || 
    user?.username || 
    user?.email?.split("@")[0] || 
    "Estudiante";

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 font-sans">
      
      {/* Tarjeta del Encabezado Principal */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col items-center text-center space-y-4">
        
        {/* Icono de Usuario / Avatar */}
        <div className="w-24 h-24 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-12 h-12"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" 
            />
          </svg>
        </div>

        {/* Información Principal */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">{displayName}</h2>
          {/* El recuadro rojo de la captura ahora muestra únicamente "Estudiante" */}
          <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-4 py-1 rounded-full mt-2 inline-block">
            Estudiante
          </p>
        </div>
      </div>

      {/* Tarjeta de Detalles de la Cuenta */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-800">Información del Usuario</h3>
        </div>

        <div className="divide-y divide-gray-100 px-6">
          {/* Campo: Nombre Completo */}
          <div className="py-4 grid grid-cols-3 gap-4 items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre Completo</span>
            <span className="text-sm font-semibold text-gray-900 col-span-2 uppercase">{displayName}</span>
          </div>

          {/* Campo: Correo Institucional */}
          <div className="py-4 grid grid-cols-3 gap-4 items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Correo Institucional</span>
            <span className="text-sm font-medium text-gray-600 col-span-2">{user.email}</span>
          </div>

          {/* Campo: ID de Registro */}
          <div className="py-4 grid grid-cols-3 gap-4 items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ID de Registro</span>
            <span className="text-sm font-mono text-gray-600 col-span-2">{user.id}</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}