interface WelcomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export default function WelcomePage({ onNavigateToLogin, onNavigateToRegister }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 flex flex-col font-sans">
      
      {/* NAV BAR (Limpia: Sin enlaces de navegación internos ni badges residuales) */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black tracking-tight text-blue-600">Espacios.</span>
        </div>
        
        {/* Botones de Acceso */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onNavigateToRegister}
            className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
          >
            Registrarse
          </button>
          <button 
            onClick={onNavigateToLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm"
          >
            Ingresar al Sistema
          </button>
        </div>
      </header>

      {/* HERO SECTION PRINCIPAL */}
      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        
        {/* Columna Izquierda: Mensajes Principales */}
        <div className="lg:col-span-6 text-left space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider">
            🚀 Nueva Sede Central de Reservas
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Gana el espacio y la concentración que tus <span className="text-blue-600">proyectos necesitan</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
            Gestiona, aparta y audita la disponibilidad de cubículos y laboratorios en tiempo real. Diseñado exclusivamente para optimizar los espacios académicos de la comunidad universitaria.
          </p>
        </div>

        {/* Columna Derecha: Ilustración limpia de un salón académico grande */}
        <div className="lg:col-span-6 flex justify-center items-center w-full">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200/80 w-full max-w-md aspect-[4/3] flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
            
            {/* Representación del Tablero Principal / Zona de Proyección */}
            <div className="w-full h-32 bg-slate-100 rounded-xl border border-slate-200/60 flex items-center justify-center relative p-4 shadow-inner">
              <div className="absolute top-2 left-3 flex gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-mono font-bold text-slate-400 tracking-widest uppercase">Área de Estudio Grande</p>
                <p className="text-sm font-sans font-extrabold text-blue-600">Aulas de Cómputo & Cubículos</p>
              </div>
            </div>

            {/* Distribución geométrica de puestos de estudio del salón */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="h-16 bg-gray-50 rounded-lg border border-gray-200 p-2 flex flex-col justify-between shadow-sm">
                <span className="w-4 h-1.5 rounded-sm bg-blue-500"></span>
                <span className="text-[10px] font-bold text-gray-400 font-mono">ZONA A</span>
              </div>
              <div className="h-16 bg-gray-50 rounded-lg border border-gray-200 p-2 flex flex-col justify-between shadow-sm">
                <span className="w-4 h-1.5 rounded-sm bg-emerald-500"></span>
                <span className="text-[10px] font-bold text-gray-400 font-mono">ZONA B</span>
              </div>
              <div className="h-16 bg-blue-50/60 rounded-lg border border-blue-200 p-2 flex flex-col justify-between shadow-sm relative">
                <span className="w-4 h-1.5 rounded-sm bg-blue-600"></span>
                <span className="text-[10px] font-bold text-blue-600 font-mono">DISPONIBLE</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-400 font-medium">
        &copy; {new Date().getFullYear()} Sistema Espacios - Universidad de Nariño. Desarrollado para la gestión académica eficaz.
      </footer>
    </div>
  );
}