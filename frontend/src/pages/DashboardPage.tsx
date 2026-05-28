// src/pages/DashboardPage.tsx
import { useSpaces } from "../hooks/useSpaces";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// Importamos los componentes necesarios de Recharts para pintar la gráfica
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  // 1. Consumimos los espacios usando tu hook
  const { data: spaces, isLoading: loadingSpaces, isError: errorSpaces } = useSpaces();

  // 2. Consumimos las reservas directamente desde tu API
  const { data: reservations, isLoading: loadingReservations, isError: errorReservations } = useQuery<any[]>({
    queryKey: ["reservations"],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/reservations`);
      return data;
    },
  });

  if (loadingSpaces || loadingReservations) return <div className="p-6 text-sm text-gray-500">Cargando métricas...</div>;
  if (errorSpaces || errorReservations) return <div className="p-6 text-sm text-red-600">Error al sincronizar con el backend.</div>;

  // 3. Cálculos estadísticos en tiempo real
  const totalSpaces = spaces?.length ?? 0;
  const availableSpaces = spaces?.filter((s: any) => s.isAvailable).length ?? 0;
  const totalReservations = reservations?.length ?? 0;

  // 4. Estructurar dinámicamente los datos para Recharts
  // Mapeamos cada espacio y contamos cuántas reservas tiene asignadas actualmente
  const chartData = spaces?.map((space: any) => {
    const spaceReservationsCount = reservations?.filter(
      (res: any) => res.spaceId === space.id
    ).length ?? 0;

    return {
      name: space.name, // Nombre del salón o cubículo (Eje X)
      "Reservas Totales": spaceReservationsCount, // Cantidad de reservas (Eje Y)
    };
  }) ?? [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Fila superior de tarjetas estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tarjeta 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total de Espacios</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">{totalSpaces}</h2>
        </div>

        {/* Tarjeta 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Espacios Disponibles</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">{availableSpaces}</h2>
        </div>

        {/* Tarjeta 3 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Reservas Registradas</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">{totalReservations}</h2>
        </div>
      </div>

      {/* Nueva Sección de Gráficas de Ocupación */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Uso y Demanda por Espacio</h3>
          <p className="text-xs text-gray-500">Cantidad total de reservas agendadas en cada ambiente académico.</p>
        </div>

        {/* Contenedor Responsive de la Gráfica */}
        <div className="w-full h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Bar 
                  dataKey="Reservas Totales" 
                  fill="#2563eb" // Azul formal coincidente con tu paleta
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-lg">
              <p className="text-sm text-gray-400">No hay datos suficientes para generar la gráfica.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}