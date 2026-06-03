import { createContext, useContext, useState, ReactNode } from "react";

// Tipamos el usuario exactamente con los campos reales de tu Base de Datos/Backend
type UserSession = {
  id: number;
  email: string;
  fullName: string;
  roleId: number;
};

type AuthContextType = {
  user: UserSession | null;
  login: (token: string, user: UserSession) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Persistencia: Al cargar la app, verifica si ya había un usuario guardado
  const [user, setUser] = useState<UserSession | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (token: string, userSession: UserSession) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userSession));
    setUser(userSession);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para consumir el contexto en cualquier página o botón
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}