import { useState, useEffect } from "react";
import axios from "axios";

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del formulario (Usando 'true' o 'false' internamente en cadena para el select)
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState<number | string>(
    "",
  );
  const [location, setLocation] = useState("");
  const [isAvailable, setIsAvailable] = useState("true"); // 'true' = Disponible, 'false' = Ocupado

  // Estado para controlar si estamos editando un espacio existente
  const [editingSpaceId, setEditingSpaceId] = useState<
    number | null
  >(null);

  // --- FUNCIÓN PARA OBTENER LOS HEADERS DE AUTORIZACIÓN ---
  const getAuthHeaders = () => {
    const userString = localStorage.getItem("user");

    if (!userString) {
      console.error("No existe usuario autenticado");
      return {
        headers: {},
      };
    }

    const user = JSON.parse(userString);

    console.log("Usuario encontrado:", user);

    return {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    };
  };

  // Cargar los espacios al iniciar la página
  const fetchSpaces = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/spaces`,
      );
      setSpaces(data);
    } catch (error) {
      console.error("Error al cargar espacios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  // Limpiar el formulario y salir del modo edición
  const resetForm = () => {
    setName("");
    setCapacity("");
    setLocation("");
    setIsAvailable("true");
    setEditingSpaceId(null);
  };

  // Guardar un espacio nuevo o actualizar uno existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mapeo exacto hacia las propiedades del DTO y Prisma
    const payload = {
      name,
      capacity: Number(capacity),
      location,
      isAvailable: isAvailable === "true", // Conversión limpia a booleano pura
    };

    try {
      if (editingSpaceId) {
        // MODO EDICIÓN: Petición PATCH con Token
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/spaces/${editingSpaceId}`,
          payload,
          getAuthHeaders(),
        );
        alert("¡Espacio actualizado con éxito!");
      } else {
        // MODO CREACIÓN: Petición POST con Token
        await axios.post(
          `${import.meta.env.VITE_API_URL}/spaces`,
          payload,
          getAuthHeaders(),
        );
        alert("¡Espacio creado con éxito!");
      }
      resetForm();
      fetchSpaces();
    } catch (error: any) {
      console.error(
        "Error detallado del Backend:",
        error.response?.data,
      );
      alert(
        error.response?.data?.message ||
          "Error al procesar la solicitud. Revisa las propiedades enviadas.",
      );
    }
  };

  // Carga los datos existentes en el formulario respetando el booleano original
  const handleEditClick = (space: any) => {
    setEditingSpaceId(space.id);
    setName(space.name);
    setCapacity(space.capacity);
    setLocation(space.location);
    // Convierte el booleano proveniente de la BD a String para que el select lo marque correctamente
    setIsAvailable(space.isAvailable ? "true" : "false");
  };

  // Eliminar un espacio físico de la base de datos
  const handleDeleteClick = async (id: number) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este espacio por completo?",
      )
    ) {
      try {
        // Petición DELETE con Token
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/spaces/${id}`,
          getAuthHeaders(),
        );
        alert("Espacio eliminado con éxito");
        fetchSpaces();
        if (editingSpaceId === id) resetForm();
      } catch (error) {
        console.error("Error al eliminar espacio:", error);
        alert(
          "No se pudo eliminar el espacio (Verifica si tiene reservas asociadas)",
        );
      }
    }
  };

  if (loading)
    return (
      <div className="p-6 text-slate-600 font-medium">
        Cargando espacios...
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Gestión de Espacios
      </h1>

      {/* FORMULARIO DINÁMICO */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8 flex flex-wrap gap-4 items-end"
      >
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-slate-600">
            Nombre del Espacio
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Sala de Reuniones"
            className="border p-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            required
          />
        </div>

        <div className="flex flex-col gap-1 w-32">
          <label className="text-xs font-semibold text-slate-600">
            Capacidad Máxima
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="1"
            className="border p-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            required
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-slate-600">
            Ubicación
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej. Piso 3"
            className="border p-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            required
          />
        </div>

        <div className="flex flex-col gap-1 w-44">
          <label className="text-xs font-semibold text-slate-600">
            Estado Actual
          </label>
          <select
            value={isAvailable}
            onChange={(e) => setIsAvailable(e.target.value)}
            className="border p-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800"
          >
            <option value="true">Disponible</option>
            <option value="false">Ocupado</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition text-sm whitespace-nowrap"
          >
            {editingSpaceId
              ? "Actualizar Espacio"
              : "Agregar Espacio"}
          </button>

          {editingSpaceId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 transition text-sm"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* TABLA DE ESPACIOS */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-sm font-semibold border-b border-slate-200">
              <th className="p-4">Nombre</th>
              <th className="p-4">Capacidad</th>
              <th className="p-4">Ubicación</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
            {spaces.map((space) => (
              <tr
                key={space.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="p-4 font-semibold text-slate-900">
                  {space.name}
                </td>
                <td className="p-4 text-slate-600">
                  {space.capacity} personas
                </td>
                <td className="p-4 text-slate-600">
                  {space.location}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      space.isAvailable
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {space.isAvailable
                      ? "Disponible"
                      : "Ocupado"}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-center items-center">
                  <button
                    onClick={() => handleEditClick(space)}
                    className="px-3 py-1 bg-slate-100 text-slate-700 font-bold rounded hover:bg-slate-200 transition text-xs"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteClick(space.id)
                    }
                    className="px-3 py-1 bg-white border border-slate-200 text-slate-500 font-bold rounded hover:bg-slate-50 transition text-xs"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
