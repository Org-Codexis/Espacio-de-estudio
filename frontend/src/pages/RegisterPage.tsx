import { useState } from "react";
import axios from "axios";

export default function RegisterPage({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [formData, setFormData] = useState({ 
    fullName: "", 
    email: "", 
    password: "", 
    roleId: 1 // Usamos el ID 1 que corresponde a 'STUDENT' en tu tabla de Roles
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Enviamos solo los campos permitidos y limpios que espera tu DTO de NestJS
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, formData);
      alert("¡Registro exitoso! Ya puedes iniciar sesión.");
      onSwitchToLogin(); 
    } catch (err: any) {
      console.error("Error devuelto por el servidor:", err.response?.data);
      alert(
        err.response?.data?.message || 
        "Error en la operación: No se pudo registrar el usuario."
      );
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Registro</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input 
            className="border p-2 rounded w-full" 
            placeholder="Nombre completo" 
            onChange={e => setFormData({...formData, fullName: e.target.value})} 
            required 
          />
          <input 
            className="border p-2 rounded w-full" 
            type="email" 
            placeholder="Email institucional" 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <input 
            className="border p-2 rounded w-full" 
            type="password" 
            placeholder="Contraseña" 
            onChange={e => setFormData({...formData, password: e.target.value})} 
            required 
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 mt-2">
            Registrar
          </button>
        </form>
        
        <button 
          onClick={onSwitchToLogin} 
          className="mt-4 text-blue-500 underline text-sm block text-center w-full"
        >
          ¿Ya tienes cuenta? Login
        </button>
      </div>
    </div>
  );
}