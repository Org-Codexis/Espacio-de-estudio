interface SidebarMenuProps {
  current: string;
  onChange: (page: string) => void;
  onLogout: () => void;
  user: any; 
}

export default function SidebarMenu({ current, onChange, onLogout, user }: SidebarMenuProps) {
  const localUserString = localStorage.getItem("user");
  const parsedLocalUser = localUserString ? JSON.parse(localUserString) : null;
  
  const activeUser = user && Object.keys(user).length > 0 ? user : parsedLocalUser;

  console.log("Datos del usuario activo en Sidebar:", activeUser);

  const isStudent = activeUser?.roleId === 1 || activeUser?.role?.id === 1;
  const userRoleText = isStudent ? "Estudiante" : "Administrador";

  const displayName = 
    activeUser?.fullName || 
    activeUser?.name || 
    activeUser?.nombre || 
    activeUser?.username ||
    activeUser?.user?.name ||       
    activeUser?.user?.nombre ||   
    activeUser?.NAME ||             
    activeUser?.NOMBRE || 
    activeUser?.email?.split("@")[0] || 
    "Usuario Registrado";

  const initialLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 p-4 justify-between min-h-screen font-sans">
      <div className="flex flex-col gap-2">
        
        <div className="mb-4 px-2">
          <h1 className="text-xl font-bold tracking-wide">Espacios.</h1>
          <p className="text-[10px] text-slate-400 tracking-widest uppercase">SISTEMA DE GESTIÓN</p>
        </div>

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

        <nav className="flex flex-col gap-1">
          {!isStudent && (
            <>
              <button 
                onClick={() => onChange("dashboard")} 
                className={`w-full text-left p-3 rounded-xl font-medium text-sm transition ${current === "dashboard" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
              >
                📊 Dashboard
              </button>
              <button 
                onClick={() => onChange("users")} 
                className={`w-full text-left p-3 rounded-xl font-medium text-sm transition ${current === "users" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
              >
                👥 Usuarios
              </button>
              <button 
                onClick={() => onChange("spaces")} 
                className={`w-full text-left p-3 rounded-xl font-medium text-sm transition ${current === "spaces" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
              >
                🏢 Espacios
              </button>
              <button 
                onClick={() => onChange("reservations")} 
                className={`w-full text-left p-3 rounded-xl font-medium text-sm transition ${current === "reservations" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
              >
                📅 Control Reservas
              </button>
              <button 
                onClick={() => onChange("reports")} 
                className={`w-full text-left p-3 rounded-xl font-medium text-sm transition ${current === "reports" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
              >
                📋 Reportes
              </button>
            </>
          )}

          {isStudent && (
            <>
              <button 
                onClick={() => onChange("reservations")} 
                className={`w-full text-left p-3 rounded-xl font-medium text-sm transition ${current === "reservations" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
              >
                📅 Mis Reservas
              </button>
              <button 
                onClick={() => onChange("history")} 
                className={`w-full text-left p-3 rounded-xl font-medium text-sm transition ${current === "history" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
              >
                🕒 Historial
              </button>
              <button 
                onClick={() => onChange("penalties")} 
                className={`w-full text-left p-3 rounded-xl font-medium text-sm transition ${current === "penalties" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
              >
                📋 Reportes
              </button>
              <button 
                onClick={() => onChange("profile")} 
                className={`w-full text-left p-3 rounded-xl font-medium text-sm transition ${current === "profile" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
              >
                👤 Perfil
              </button>
            </>
          )}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/60">
        <button 
          onClick={onLogout}
          className="w-full text-left p-3 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2.5 shadow-lg shadow-blue-600/10 active:scale-[0.98]"
        >
          <span>🚪</span> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}