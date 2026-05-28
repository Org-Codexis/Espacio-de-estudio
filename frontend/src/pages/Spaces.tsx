import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function Spaces() {
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/spaces')
      .then((res) => res.json())
      .then((data) => setSpaces(data))
      .catch((err) => console.error('Error cargando espacios:', err));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Espacios de Estudio Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {spaces.map((space: any) => (
          <div key={space.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-700">{space.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Capacidad: {space.capacity} personas</p>
              <p className="text-sm text-gray-500">Ubicación: {space.location}</p>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
              Reservar Espacio
            </button>
          </div>
        ))}
        {spaces.length === 0 && (
          <p className="text-gray-500">No hay espacios registrados en la base de datos.</p>
        )}
      </div>
    </Layout>
  );
}