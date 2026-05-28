import { useState, useEffect } from "react";
import axios from "axios";

export default function ReservationsPage() {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [myReservations, setMyReservations] = useState<any[]>([]);
  const [allReservations, setAllReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Campos que el estudiante diligencia (Eliminamos peopleCount de los estados)
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;
  const currentUserId = currentUser?.id || null; 

  const fetchData = async () => {
    if (!currentUserId) return;
    try {
      const resSpaces = await axios.get(`${import.meta.env.VITE_API_URL}/spaces`);
      setSpaces(resSpaces.data);

      const resReservations = await axios.get(`${import.meta.env.VITE_API_URL}/reservations`);
      setAllReservations(resReservations.data);

      const filtered = resReservations.data.filter((r: any) => r.userId === currentUserId);
      setMyReservations(filtered);
    } catch (error) {
      console.error("Error al cargar los datos de reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const checkIfOccupied = () => {
    if (!selectedSpaceId || !reservationDate || !startTime || !endTime) return false;

    return allReservations.some((res) => {
      const flatResDate = res.reservationDate ? res.reservationDate.split("T")[0] : "";
      if (
        res.spaceId !== Number(selectedSpaceId) || 
        flatResDate !== reservationDate || 
        res.status === "CANCELED"
      ) {
        return false;
      }
      return startTime < res.endTime && endTime > res.startTime;
    });
  };

  const isTimeSlotOccupied = checkIfOccupied();

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      alert("Error: Sesión de usuario no válida.");
      return;
    }

    if (isTimeSlotOccupied) {
      alert("El espacio ya se encuentra ocupado en la fecha y rango de horas seleccionado.");
      return;
    }

    const currentSpace = spaces.find((s) => s.id === Number(selectedSpaceId));
    if (!currentSpace) {
      alert("Por favor selecciona un espacio válido.");
      return;
    }

    // 1. FORMATEAR FECHA A ISO: Pasamos "2026-06-04" a un objeto Date real para que @IsDateString() no falle
    const formattedDate = new Date(reservationDate);

    // 2. FORMATEAR HORAS: Aseguramos formato 24h por si el navegador devuelve "p. m. / a. m."
    const formatTimeTo24h = (timeStr: string) => {
      if (!timeStr) return "";
      // Si ya viene en formato 24h limpio (ej. "14:30"), lo dejamos igual
      if (!timeStr.includes("m.") && !timeStr.includes("M.")) return timeStr;

      // Si viene con "a. m." o "p. m.", lo convertimos
      const isPm = timeStr.toLowerCase().includes("p");
      let [hoursStr, minutesStr] = timeStr.replace(/[a-zA-Z\.\s]/g, "").split(":");
      let hours = parseInt(hoursStr, 10);
      const minutes = minutesStr;

      if (isPm && hours < 12) hours += 12;
      if (!isPm && hours === 12) hours = 0;

      return `${String(hours).padStart(2, "0")}:${minutes}`;
    };

    const cleanStartTime = formatTimeTo24h(startTime);
    const cleanEndTime = formatTimeTo24h(endTime);

    // Construimos el payload con los datos exactamente como los pide el DTO
    const payload = {
      userId: currentUserId,
      spaceId: Number(selectedSpaceId),
      reservationDate: formattedDate, // Enviamos el objeto/ISO String
      startTime: cleanStartTime,      // "08:40"
      endTime: cleanEndTime,          // "22:40"
      peopleCount: Number(currentSpace.capacity),
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reservations`, payload);
      alert("¡Reserva solicitada con éxito!");
      
      // Limpiar formulario
      setSelectedSpaceId("");
      setReservationDate("");
      setStartTime("");
      setEndTime("");
      
      fetchData();
    } catch (error: any) {
      // Si vuelve a fallar, el backend nos dirá exactamente qué propiedad falló (ej: validation errors)
      const errorMsg = error.response?.data?.message;
      if (Array.isArray(errorMsg)) {
        alert(`Error de validación:\n- ${errorMsg.join("\n- ")}`);
      } else {
        alert(errorMsg || "Error interno del servidor al procesar el agendamiento.");
      }
    }
  };

  if (loading) return <div className="p-6 text-slate-600">Cargando tus reservas...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Historial de Reservas</h1>

      {/* FORMULARIO MEJORADO CON REJILLA AJUSTADA A 4 COLUMNAS */}
      <div className="bg-white p-6 rounded-xl shadow border border-slate-200 mb-8">
        <form onSubmit={handleCreateReservation} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-600">Seleccionar Espacio</label>
            <select
              value={selectedSpaceId}
              onChange={(e) => setSelectedSpaceId(e.target.value)}
              className="border p-2 rounded-lg text-sm bg-white text-slate-800"
              required
            >
              <option value="">Selecciona un espacio...</option>
              {spaces.map((space) => (
                <option key={space.id} value={space.id}>
                  {space.name} ({space.location}) — Capacidad: {space.capacity} pers.
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-600">Fecha</label>
            <input
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              className="border p-2 rounded-lg text-sm text-slate-800"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-600">Hora de Inicio</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border p-2 rounded-lg text-sm text-slate-800"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-600">Hora de Fin</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border p-2 rounded-lg text-sm text-slate-800"
              required
            />
          </div>

          <div className="md:col-span-4 flex justify-end mt-2">
            <button
              type="submit"
              disabled={isTimeSlotOccupied}
              className={`px-6 py-2.5 rounded-lg text-white font-bold text-sm transition ${
                isTimeSlotOccupied 
                  ? "bg-red-500 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isTimeSlotOccupied ? "Sala Ocupada en esta hora" : "Reservar Espacio"}
            </button>
          </div>
        </form>
      </div>

      {/* TABLA DE HISTORIAL EXCLUSIVO */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-xs font-semibold border-b border-slate-200">
              <th className="p-4">Espacio</th>
              <th className="p-4">Fecha de Reserva</th>
              <th className="p-4">Hora Inicio</th>
              <th className="p-4">Hora Fin</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
            {myReservations.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-400 italic">
                  No has realizado ninguna solicitud de reserva aún.
                </td>
              </tr>
            ) : (
              myReservations.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold text-slate-900">{res.space?.name}</td>
                  <td className="p-4 text-slate-600">
                    {res.reservationDate ? res.reservationDate.split("T")[0] : ""}
                  </td>
                  <td className="p-4 font-mono text-slate-600">{res.startTime}</td>
                  <td className="p-4 font-mono text-slate-600">{res.endTime}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      res.status === "CONFIRMED" 
                        ? "bg-blue-50 text-blue-700" 
                        : res.status === "PENDING" 
                        ? "bg-amber-50 text-amber-700" 
                        : "bg-red-50 text-red-700"
                    }`}>
                      {res.status === "PENDING" && "Pendiente"}
                      {res.status === "CONFIRMED" && "Confirmada"}
                      {res.status === "CANCELED" && "Cancelada"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}