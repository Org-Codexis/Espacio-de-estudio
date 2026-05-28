interface SidebarMenuProps {
  current: string;
  onChange: (page: string) => void;
  onLogout: () => void;
  user: any; 
}

export default function SidebarMenu({ current, onChange, onLogout, user }: SidebarMenuProps) {
  // 1. INTENTAR LEER DESDE LOCALSTORAGE SI EL PROP LLEGA VACÍO
  const localUserString = localStorage.getItem("user");
  const parsedLocalUser = localUserString ? JSON.parse(localUserString) : null;
  
  const activeUser = user && Object.keys(user).length > 0 ? user : parsedLocalUser;

  // 🔍 CONTROL DE DAÑOS: Imprime en la consola para saber exactamente cómo estructuró tu backend el objeto
  console.log("Datos del usuario activo en Sidebar:", activeUser);

  // 2. Extraer el rol (roleId === 1 es Estudiante, cualquier otro es Admin)
  const isStudent = activeUser?.roleId === 1 || activeUser?.role?.id === 1;
  const userRoleText = isStudent ? "Estudiante" : "Administrador";

  // 3. MAPEO AGRESIVO DE PROPIEDADES (Validamos minúsculas, mayúsculas y anidaciones comunes de bases de datos)
  const displayName = 
    activeUser?.name || 
    activeUser?.nombre || 
    activeUser?.username ||
    activeUser?.user?.name ||       // Por si viene anidado
    activeUser?.user?.nombre ||   
    activeUser?.NAME ||             // Por si la base de datos lo devuelve en mayúsculas
    activeUser?.NOMBRE || 
    activeUser?.email?.split("@")[0] || // Si no hay de otra, la primera parte del correo
    "Usuario Registrado";

  const initialLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 p-4 justify-between min-h-screen">
      <div className="flex flex-col gap-2">
        
        {/* CABECERA DEL SISTEMA */}
        <div className="mb-4 px-2">
          <h1 className="text-xl font-bold tracking-wide">Espacios.</h1>
          <p className="text-[10px] text-slate-400 tracking-widest uppercase">SISTEMA DE GESTIÓN</p>
        </div>

        {/* --- TARJETA DE PERFIL REAL Y DINÁMICA --- */}
        <div className="bg-slate-800/60 rounded-xl p-3.5 mb-5 border border-slate-700/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-blue-900/30 shrink-0">
            {initialLetter}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-100 truncate flex-1" title={displayName}>
              {displayName}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isStudent ? "bg-blue-400" : "bg-amber-400"}`}></span>
              <span className="text-[11px] font-medium text-slate-400 tracking-wide">
                {userRoleText}
              </span>
            </div>
          </div>
        </div>

        {/* --- MENÚ DE NAVEGACIÓN --- */}
        <nav className="flex flex-col gap-1">
          {!isStudent && (
            <>
              <button 
                onClick={() => onChange("dashboard")} 
                className={`w-full text-left p-3 rounded-lg font-medium text-sm transition ${current === "dashboard" ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"}`}
              >
                📊 Dashboard
              </button>
              <button 
                onClick={() => onChange("users")} 
                className={`w-full text-left p-3 rounded-lg font-medium text-sm transition ${current === "users" ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"}`}
              >
                👥 Usuarios
              </button>
              <button 
                onClick={() => onChange("spaces")} 
                className={`w-full text-left p-3 rounded-lg font-medium text-sm transition ${current === "spaces" ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"}`}
              >
                🏢 Espacios
              </button>
            </>
          )}

          <button 
            onClick={() => onChange("reservations")} 
            className={`w-full text-left p-3 rounded-lg font-medium text-sm transition ${current === "reservations" ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"}`}
          >
            📅 Reservas
          </button>

          {!isStudent && (
            <button 
              onClick={() => onChange("reports")} 
              className={`w-full text-left p-3 rounded-lg font-medium text-sm transition ${current === "reports" ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"}`}
            >
              📋 Reportes
            </button>
          )}
        </nav>
      </div>

      {/* BOTÓN DE SALIR */}
      <div className="pt-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full text-left p-3 rounded-lg font-medium text-sm text-red-400 hover:bg-slate-800 transition"
        >
          🚪 Salir
        </button>
      </div>
    </div>
  );
}