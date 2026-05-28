import { useState } from "react";
import axios from "axios";

interface LoginPageProps {
  onLogin: (user: any) => void;
  onSwitchToRegister: () => void;
}

export default function LoginPage({
  onLogin,
  onSwitchToRegister,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Obtiene la lista de usuarios del backend
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
      );

      // Busca el usuario por su email
      const user = data.find((u: any) => u.email === email);

      // Compara las credenciales en texto plano tal como están en tu BD
      if (user && user.password === password) {
        onLogin(user);
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (err) {
      alert("Error de conexión al servidor");
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          Iniciar Sesión
        </h2>
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-3"
        >
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 mt-2">
            Entrar
          </button>
        </form>

        <button
          onClick={onSwitchToRegister}
          className="mt-4 text-blue-500 underline text-sm block text-center w-full"
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </div>
  );
}
