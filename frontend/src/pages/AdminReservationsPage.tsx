import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/reservations`);
      setReservations(data);
    } catch (error) {
      console.error("Error al cargar historial de reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: "CONFIRMED" | "CANCELED") => {
    const actionText = newStatus === "CONFIRMED" ? "Aceptar" : "Cancelar";
    if (window.confirm(`¿Estás seguro de que deseas ${actionText} esta reserva?`)) {
      try {
        // Petición limpia enviando el nuevo estado en el cuerpo (body) hacia /reservations/:id
        await axios.patch(`${import.meta.env.VITE_API_URL}/reservations/${id}`, {
          status: newStatus,
        });

        alert(`Reserva modificada con éxito.`);
        fetchReservations(); // Refresca la tabla de inmediato
      } catch (error: any) {
        console.error("Error al actualizar la reserva:", error);
        alert(error.response?.data?.message || "Ocurrió un inconveniente al actualizar.");
      }
    }
  };

  if (loading) return <div className="p-6 text-slate-600 font-medium">Cargando panel de reservas...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Panel de Control: Solicitudes de Reservas</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-xs font-semibold border-b border-slate-200">
              <th className="p-4">Estudiante</th>
              <th className="p-4">Salón Solicitado</th>
              <th className="p-4">Fecha Solicitada</th>
              <th className="p-4">Hora de Inicio</th>
              <th className="p-4">Hora de Fin</th>
              <th className="p-4">Estado Actual</th>
              <th className="p-4 text-center">Acción Administrativa</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
            {reservations.map((res) => (
              <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-semibold text-slate-900">{res.user?.fullName || "David"}</td>
                <td className="p-4 text-slate-600">{res.space?.name || res.spaceId}</td>
                <td className="p-4 text-slate-600">
                  {res.reservationDate ? res.reservationDate.split("T")[0] : ""}
                </td>
                <td className="p-4 font-mono text-slate-600">{res.startTime}</td>
                <td className="p-4 font-mono text-slate-600">{res.endTime}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      res.status === "CONFIRMED"
                        ? "bg-blue-50 text-blue-700"
                        : res.status === "PENDING"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {res.status === "PENDING" && "Pendiente"}
                    {res.status === "CONFIRMED" && "Confirmada"}
                    {res.status === "CANCELED" && "Cancelada"}
                  </span>
                </td>
                <td className="p-4 flex gap-3 justify-center items-center">
                  {/* BOTONES SIEMPRE DISPONIBLES PARA EL ADMINISTRADOR */}
                  <button
                    onClick={() => handleUpdateStatus(res.id, "CONFIRMED")}
                    disabled={res.status === "CONFIRMED"}
                    className={`px-3 py-1 font-bold rounded text-xs transition ${
                      res.status === "CONFIRMED"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(res.id, "CANCELED")}
                    disabled={res.status === "CANCELED"}
                    className={`px-3 py-1 font-bold rounded text-xs transition ${
                      res.status === "CANCELED"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    Cancelar
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