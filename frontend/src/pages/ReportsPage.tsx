import { useState, useEffect } from "react";
import axios from "axios";

export default function ReportsPage() {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [allReservations, setAllReservations] = useState<any[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const resSpaces = await axios.get(`${import.meta.env.VITE_API_URL}/spaces`);
      setSpaces(resSpaces.data);

      const resReservations = await axios.get(`${import.meta.env.VITE_API_URL}/reservations`);
      setAllReservations(resReservations.data);

      if (resSpaces.data.length > 0) {
        setSelectedSpaceId(resSpaces.data[0].id);
      }
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // FUNCIÓN AUXILIAR: Convierte "16:00" en "04:00 p. m." u "08:00" en "08:00 a. m."
  const format12h = (timeStr: string) => {
    if (!timeStr) return "";
    const [hoursStr, minutesStr] = timeStr.split(":");
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "p. m." : "a. m.";
    
    hours = hours % 12;
    hours = hours ? hours : 12; // El número 0 debe ser 12
    const cleanHours = String(hours).padStart(2, "0");
    
    return `${cleanHours}:${minutesStr} ${ampm}`;
  };

  if (loading) return <div className="p-6 text-slate-600">Cargando reportes de ocupación...</div>;

  // Filtrar cronograma: Solo reservas CONFIRMADAS para el salón seleccionado
  const activeSchedules = allReservations.filter(
    (res) => res.spaceId === selectedSpaceId && res.status === "CONFIRMED"
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Reportes de Ocupación</h1>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-xs font-semibold border-b border-slate-200">
              <th className="p-4">Espacio</th>
              <th className="p-4">Ubicación</th>
              <th className="p-4">Total de Reservas Asociadas</th>
              <th className="p-4">Estado Actual</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
            {spaces.map((space) => {
              const totalUses = allReservations.filter((r) => r.spaceId === space.id).length;

              return (
                <tr 
                  key={space.id} 
                  onClick={() => setSelectedSpaceId(space.id)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                    selectedSpaceId === space.id ? "bg-blue-50/60 font-medium" : ""
                  }`}
                >
                  <td className="p-4 text-slate-900 font-semibold">{space.name}</td>
                  <td className="p-4 text-slate-600">{space.location}</td>
                  <td className="p-4 text-slate-600">{totalUses} usos</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded text-xs font-bold bg-green-50 text-green-700">
                      Libre
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CRONOGRAMA DETALLADO */}
      <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Cronograma de Ocupación Próxima
            </h2>
            <p className="text-xs text-slate-500">
              Selecciona una fila arriba para auditar las horas reservadas de cada salón.
            </p>
          </div>
          
          <select
            value={selectedSpaceId || ""}
            onChange={(e) => setSelectedSpaceId(Number(e.target.value))}
            className="border p-2 rounded-lg text-sm bg-white text-slate-800 font-medium border-slate-300"
          >
            {spaces.map((s) => (
              <option key={s.id} value={s.id}>
                Ver agenda: {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-200">
                <th className="p-4">Estudiante</th>
                <th className="p-4">Fecha Solicitada</th>
                <th className="p-4">Hora de Inicio</th>
                <th className="p-4">Hora de Fin</th>
                <th className="p-4">Nivel de Uso</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
              {activeSchedules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400 italic bg-slate-50/50">
                    No hay reservas confirmadas próximamente para este espacio. Está completamente disponible.
                  </td>
                </tr>
              ) : (
                activeSchedules.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">
                      {res.user?.name || "David"} 
                    </td>
                    <td className="p-4 text-slate-600">
                      {res.reservationDate ? res.reservationDate.split("T")[0] : ""}
                    </td>
                    {/* Aplicamos la función format12h aquí en las celdas */}
                    <td className="p-4 font-mono font-medium text-blue-700 bg-blue-50/30 text-center">
                      {format12h(res.startTime)}
                    </td>
                    <td className="p-4 font-mono font-medium text-amber-700 bg-amber-50/30 text-center">
                      {format12h(res.endTime)}
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-slate-500 font-medium">
                        Ocupado ({res.peopleCount} asistentes)
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}