import { useState, useEffect } from "react";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainLayout from "./layouts/MainLayout";
import SidebarMenu from "./components/SidebarMenu";

// Páginas del Administrador
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import SpacesPage from "./pages/SpacesPage"; 
import ReportsPage from "./pages/ReportsPage";

// Páginas de Reservas Independientes
import ReservationsPage from "./pages/ReservationsPage";       
import AdminReservationsPage from "./pages/AdminReservationsPage"; 

function App() {
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState("dashboard");
  const [loadingSession, setLoadingSession] = useState(true); // 👈 Controla el estado crítico de lectura inicial
  
  // Manejo de navegación unificado compatible con botones Atrás/Adelante del navegador
  const [view, setView] = useState<"welcome" | "login" | "register">("welcome");

  // Función para cambiar de vista empujando el estado en el historial de navegación
  const navigateTo = (newView: "welcome" | "login" | "register") => {
    setView(newView);
    window.history.pushState({ view: newView }, "");
  };

  useEffect(() => {
    // Escuchar cuando el usuario presiona las flechas de Atrás/Adelante del navegador
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
      } else {
        setView("welcome"); // Estado inicial por defecto
      }
    };

    window.addEventListener("popstate", handlePopState);
    
    // Inicializar el estado en el historial al cargar la aplicación por primera vez
    window.history.replaceState({ view: "welcome" }, "");

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setPage(parsedUser.roleId === 1 ? "reservations" : "dashboard");
    }

    setLoadingSession(false); // 👈 Finaliza la carga una vez evaluado el localStorage

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Espera a que termine de leer el localStorage para evitar renderizar componentes sin datos de usuario
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-gray-500">Cargando Sistema...</p>
        </div>
      </div>
    );
  }

  // FLUJO DE ACCESO PREVIO A ESTAR LOGUEADO
  if (!user) {
    switch (view) {
      case "welcome":
        return (
          <WelcomePage 
            onNavigateToLogin={() => navigateTo("login")} 
            onNavigateToRegister={() => navigateTo("register")}
          />
        );
      case "register":
        return (
          <RegisterPage 
            onSwitchToLogin={() => navigateTo("login")} 
          />
        );
      case "login":
        return (
          <LoginPage 
            onLogin={(u: any) => { 
              setUser(u); 
              localStorage.setItem("user", JSON.stringify(u)); 
              setPage(u.roleId === 1 ? "reservations" : "dashboard");
            }} 
            onSwitchToRegister={() => navigateTo("register")}
          />
        );
      default:
        return (
          <WelcomePage 
            onNavigateToLogin={() => navigateTo("login")} 
            onNavigateToRegister={() => navigateTo("register")}
          />
        );
    }
  }

  // PANEL INTERNO DEL SISTEMA (USUARIOS LOGUEADOS)
  const renderContent = () => {
    if (user.roleId === 1) {
      switch (page) {
        case "reservations": 
          return <ReservationsPage />; 
        default: 
          return <ReservationsPage />;
      }
    } else {
      switch (page) {
        case "dashboard": return <DashboardPage />;
        case "users": return <UsersPage />;
        case "spaces": return <SpacesPage />; 
        case "reservations": return <AdminReservationsPage />; 
        case "reports": return <ReportsPage />;
        default: return <DashboardPage />;
      }
    }
  };

  return (
    <MainLayout
      sidebar={
        <SidebarMenu 
          current={page} 
          onChange={setPage} 
          user={user} 
          onLogout={() => { 
            localStorage.clear(); 
            setUser(null);
            setView("welcome");
            window.history.replaceState({ view: "welcome" }, "");
          }} 
        />
      }
      content={renderContent()}
    />
  );
}

export default App;