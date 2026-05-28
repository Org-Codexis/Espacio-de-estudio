import { useState, useEffect } from "react";
import axios from "axios";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar los usuarios registrados desde el backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
        setUsers(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-slate-600 font-medium animate-pulse">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Gestión de Usuarios</h1>

      {/* TABLA DE USUARIOS (Únicamente visualización de los datos del RegisterPage) */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-sm font-semibold border-b border-slate-200">
              <th className="p-4">ID</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Email</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-500">#{user.id}</td>
                <td className="p-4 font-semibold text-slate-900">{user.fullName}</td>
                <td className="p-4 text-slate-600">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    user.role?.name === 'ADMIN' || user.roleId === 2
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role?.name || (user.roleId === 1 ? 'USER' : 'ADMIN')}
                  </span>
                </td>
                <td className="p-4">
                  <span className="flex items-center gap-1.5 text-green-600 font-medium">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}