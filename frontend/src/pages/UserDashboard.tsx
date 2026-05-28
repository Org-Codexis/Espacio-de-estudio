// src/pages/UserDashboard.tsx
export default function UserDashboard({ user, setUser }: { user: any, setUser: any }) {
  const logout = () => { localStorage.removeItem("user"); setUser(null); };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Usuario */}
      <aside className="w-64 bg-indigo-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Mi Espacio</h2>
        <nav className="space-y-4">
          <button className="block w-full text-left p-2 hover:bg-indigo-800 rounded">Reservar</button>
          <button className="block w-full text-left p-2 hover:bg-indigo-800 rounded">Mis Reservas</button>
          <button onClick={logout} className="mt-10 block w-full text-left p-2 text-red-300 hover:bg-indigo-800 rounded">Salir</button>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Hola, {user.fullName}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="font-bold text-lg">Nueva Reserva</h3>
            <p className="text-gray-600 mb-4">Selecciona un espacio y un horario.</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded">Ver Disponibilidad</button>
          </div>
        </div>
      </main>
    </div>
  );
}