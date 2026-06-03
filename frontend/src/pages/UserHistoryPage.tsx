import { useState, useEffect } from "react";
import axios from "axios";

export default function UserHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isExpired = (reservation: any) => {
    if (!reservation.reservationDate || !reservation.endTime) return false;

    const fecha = reservation.reservationDate.split("T")[0];
    const fechaFin = new Date(`${fecha}T${reservation.endTime}:00`);
    const ahora = new Date();

    return ahora > fechaFin;
  };

  const getStatusLabel = (reservation: any) => {
    if (reservation.status === "PENDING" && isExpired(reservation)) {
      return "EXPIRADA";
    }

    if (reservation.status === "CONFIRMED" && isExpired(reservation)) {
      return "FINALIZADA";
    }

    if (reservation.status === "CANCELED") {
      return "CANCELADA";
    }

    if (reservation.status === "PENDING") {
      return "PENDIENTE";
    }

    if (reservation.status === "CONFIRMED") {
      return "CONFIRMADA";
    }

    return reservation.status;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const userString = localStorage.getItem("user");
      const currentUser = userString ? JSON.parse(userString) : null;

      if (!currentUser?.id) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/reservations`
        );

        const pastReservations = res.data.filter((r: any) => {
          return r.userId === currentUser.id && isExpired(r);
        });

        setHistory(pastReservations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="p-6">Cargando historial...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Historial de Reservas
      </h2>

      <div className="bg-white rounded-xl shadow border border-slate-200 p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-xs uppercase">
              <th className="p-4">Espacio</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {history.map((h) => {
              const statusLabel = getStatusLabel(h);

              return (
                <tr key={h.id}>
                  <td className="p-4 font-semibold">
                    {h.space?.name}
                  </td>

                  <td className="p-4">
                    {h.reservationDate.split("T")[0]}
                  </td>

                  <td className="p-4">
                    <span
                      className={`font-bold text-xs ${
                        statusLabel === "EXPIRADA"
                          ? "text-gray-500"
                          : statusLabel === "FINALIZADA"
                          ? "text-green-600"
                          : statusLabel === "CANCELADA"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                </tr>
              );
            })}

            {history.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-slate-400">
                  No tienes reservas en el historial.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}