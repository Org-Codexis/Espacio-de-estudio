import { useState, type FormEvent } from "react";
import { http } from "../api/http";

type LoginResponse = {
  access_token: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    roleId: number;
  };
};

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await http<LoginResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          access_token: data.access_token,
          user: data.user,
        }),
      );

      onLogin(data);
    } catch (err: any) {
      console.error(err);

      setError(
        "Credenciales incorrectas o error en el servidor",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Iniciar Sesión
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Correo Institucional
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@udenar.edu.co"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onSwitchToRegister}
            className="text-sm text-blue-600 hover:underline"
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
      </div>
    </div>
  );
}
