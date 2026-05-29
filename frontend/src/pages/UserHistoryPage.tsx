import { useState, useEffect } from "react";
import axios from "axios";

export default function UserHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const userString = localStorage.getItem("user");
      const currentUser = userString ? JSON.parse(userString) : null;
      if (!currentUser?.id) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/reservations`);
        const now = new Date();
        const past = res.data.filter((r: any) => r.userId === currentUser.id && new Date(r.reservationDate) < now);
        setHistory(past);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Historial de Reservas</h2>
      <div className="bg-white rounded-xl shadow border border-slate-200 p-6">
        {loading ? <p>Cargando historial...</p> : 
          <table className="w-full text-left">
            <thead><tr className="text-slate-500 text-xs uppercase"><th className="p-4">Espacio</th><th className="p-4">Fecha</th><th className="p-4">Estado</th></tr></thead>
            <tbody className="divide-y">{history.map((h) => (
              <tr key={h.id}><td className="p-4 font-semibold">{h.space?.name}</td><td className="p-4">{h.reservationDate.split("T")[0]}</td><td className="p-4 text-green-600 font-bold text-xs">FINALIZADA</td></tr>
            ))}</tbody>
          </table>
        }
      </div>
    </div>
  );
}