import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-blue-600 p-4 text-white shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Plataforma Espacio de Estudio</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">
            👤 {user.fullName || 'Usuario'}
          </span>
          <button 
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-colors"
          >
            Salir
          </button>
        </div>
      </nav>
      <main className="container mx-auto max-w-6xl p-6">
        {children}
      </main>
    </div>
  );
}