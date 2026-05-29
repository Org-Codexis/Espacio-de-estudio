import React, { useState, useEffect } from "react";

interface Espacio {
  id: number;
  name: string;
  location: string;
  isAvailable: boolean;
}

const StudentReportsPage = () => {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [spaceId, setSpaceId] = useState<string>("");
  const [type, setType] = useState<"INCIDENT" | "OBSERVATION">("INCIDENT");
  const [description, setDescription] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargandoEspacios, setCargandoEspacios] = useState(true);

  useEffect(() => {
    const obtenerEspacios = async () => {
      try {
        // Ajusta esta URL si tu ruta para listar espacios en NestJS es diferente (ej: http://localhost:3000/spaces)
        const response = await fetch("http://localhost:3000/spaces");
        if (response.ok) {
          const data = await response.json();
          // Filtramos para mostrar solo los salones que estén disponibles para reportar
          const disponibles = data.filter((e: Espacio) => e.isAvailable);
          setEspacios(disponibles);
          
          if (disponibles.length > 0) {
            setSpaceId(String(disponibles[0].id));
          }
        }
      } catch (error) {
        console.error("Error al cargar los salones desde la base de datos:", error);
      } finally {
        setCargandoEspacios(false);
      }
    };

    obtenerEspacios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !spaceId) {
      alert("Por favor selecciona un salón y escribe una descripción.");
      return;
    }

    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("Sesión no válida. Por favor, inicia sesión de nuevo.");
      return;
    }
    const loggedUser = JSON.parse(savedUser);

    const dataForBackend = {
      userId: Number(loggedUser.id),
      spaceId: Number(spaceId),
      description: description.trim(),
      type: type,
    };

    try {
      const response = await fetch("http://localhost:3000/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForBackend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del backend:", errorData);
        throw new Error("El backend rechazó los datos");
      }

      setDescription("");
      setEnviado(true);
      setTimeout(() => setEnviado(false), 3000);
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("No se pudo guardar el reporte en la base de datos.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto font-sans">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Buzón de Reportes</h2>
        <p className="text-xs text-gray-500 mb-6">Registra sugerencias u observaciones sobre las salas de estudio.</p>

        {enviado && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg font-medium">
            Reporte almacenado correctamente en el sistema.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de Reporte</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "INCIDENT" | "OBSERVATION")}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option value="INCIDENT">Incidente / Problema</option>
              <option value="OBSERVATION">Observación / Sugerencia</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Seleccionar Salón de Estudio</label>
            {cargandoEspacios ? (
              <div className="text-xs text-gray-400 p-2">Cargando salones registrados...</div>
            ) : (
              <select
                value={spaceId}
                onChange={(e) => setSpaceId(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                required
              >
                {espacios.length === 0 ? (
                  <option value="">No hay salones disponibles en la BD</option>
                ) : (
                  espacios.map((esp) => (
                    <option key={esp.id} value={esp.id}>
                      {esp.name} ({esp.location})
                    </option>
                  ))
                )}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción de los hechos</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escribe detalladamente lo ocurrido o tu sugerencia..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={cargandoEspacios || espacios.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm"
          >
            Enviar Reporte Oficial
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentReportsPage;