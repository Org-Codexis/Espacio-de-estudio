import { useState, useEffect } from "react";

interface Reporte {
  id: number;
  description: string;
  type: "INCIDENT" | "OBSERVATION";
  createdAt: string;
  userId: number;
  spaceId: number;
  user?: { fullName: string };
  space?: { name: string };
}

const AdminReportsPage = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarReportesDesdeBD = async () => {
    try {
      const response = await fetch("http://localhost:3000/reports");
      if (!response.ok) throw new Error("Error al obtener reportes");

      const data = await response.json();
      setReportes(data);
    } catch (error) {
      console.error("Error cargando reportes de la BD:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReportesDesdeBD();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-sm font-semibold text-gray-500 font-sans">
        Cargando registros desde PostgreSQL...
      </div>
    );
  }

  const incidentesCount = reportes.filter((r) => r.type === "INCIDENT").length;
  const observacionesCount = reportes.filter((r) => r.type === "OBSERVATION").length;

  return (
    <div className="p-6 space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Panel de Control de Reportes</h1>
        <p className="text-xs text-gray-500">Gestión global de quejas, incidencias y sugerencias de los estudiantes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase">Total Registros</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{reportes.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-red-400 uppercase">Incidentes</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{incidentesCount}</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-yellow-500 uppercase">Observaciones</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{observacionesCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportes.map((rep) => (
          <div key={rep.id} className="p-4 bg-white shadow-sm rounded-xl border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    rep.type === "INCIDENT"
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                  }`}
                >
                  {rep.type === "INCIDENT" ? "Incidente" : "Observación"}
                </span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">
                  Sala ID: {rep.spaceId}
                </span>
              </div>
              <p className="text-sm text-gray-700 font-normal leading-relaxed break-words">
                {rep.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-[11px] text-gray-400 font-medium">
              <span>Usuario ID: {rep.userId}</span>
              <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {reportes.length === 0 && (
        <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-400 font-medium">No se han encontrado reportes en la base de datos.</p>
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;