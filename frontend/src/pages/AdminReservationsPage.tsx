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
    
    // Sincronización automática en segundo plano cada 30 segundos
    const interval = setInterval(fetchReservations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Comprueba si el bloque de tiempo de la reserva ya pasó por completo
  const checkIfExpired = (reserva: any) => {
    if (!reserva.reservationDate || !reserva.endTime) return false;

    try {
      // Extraemos la fecha limpia "YYYY-MM-DD"
      const fechaLimpia = reserva.reservationDate.split("T")[0];
      const [anio, mes, dia] = fechaLimpia.split("-").map(Number);
      
      // Extraemos horas y minutos del endTime "HH:MM"
      const [horasFin, minutosFin] = reserva.endTime.split(":").map(Number);

      // Creamos el objeto Date exacto del final de la reserva
      const fechaFinReserva = new Date(anio, mes - 1, dia, horasFin, minutosFin, 0, 0);
      const ahora = new Date();

      // Si el reloj actual superó la fecha/hora de fin, está expirada
      return ahora > fechaFinReserva;
    } catch (e) {
      console.error("Error al calcular expiración de reserva:", e);
      return false;
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: "CONFIRMED" | "CANCELED") => {
    const actionText = newStatus === "CONFIRMED" ? "Aceptar" : "Cancelar";
    if (window.confirm(`¿Estás seguro de que deseas ${actionText} esta reserva?`)) {
      try {
        await axios.patch(`${import.meta.env.VITE_API_URL}/reservations/${id}`, {
          status: newStatus,
        });

        alert(`Reserva modificada con éxito.`);
        fetchReservations(); 
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
            {reservations.map((res) => {
              const isExpired = checkIfExpired(res);
              
              // Si estaba PENDIENTE pero el tiempo ya pasó, el sistema la considera EXPIRADA automáticamente
              const displayStatus = (res.status === "PENDING" && isExpired) ? "EXPIRED" : res.status;

              return (
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
                        displayStatus === "CONFIRMED"
                          ? "bg-blue-50 text-blue-700"
                          : displayStatus === "PENDING"
                          ? "bg-amber-50 text-amber-700"
                          : displayStatus === "EXPIRED"
                          ? "bg-gray-100 text-gray-500 line-through"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {displayStatus === "PENDING" && "Pendiente"}
                      {displayStatus === "CONFIRMED" && "Confirmada"}
                      {displayStatus === "CANCELED" && "Cancelada"}
                      {displayStatus === "EXPIRED" && "Expirada"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-3 justify-center items-center">
                    {/* BOTÓN ACEPTAR: Deshabilitado si ya está Confirmada, Cancelada o si ya Expiró el tiempo */}
                    <button
                      onClick={() => handleUpdateStatus(res.id, "CONFIRMED")}
                      disabled={res.status === "CONFIRMED" || res.status === "CANCELED" || isExpired}
                      className={`px-3 py-1 font-bold rounded text-xs transition ${
                        (res.status === "CONFIRMED" || res.status === "CANCELED" || isExpired)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Aceptar
                    </button>
                    
                    {/* BOTÓN CANCELAR: Deshabilitado si ya está Cancelada o si ya expiró el tiempo */}
                    <button
                      onClick={() => handleUpdateStatus(res.id, "CANCELED")}
                      disabled={res.status === "CANCELED" || isExpired}
                      className={`px-3 py-1 font-bold rounded text-xs transition ${
                        (res.status === "CANCELED" || isExpired)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}