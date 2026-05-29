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
import ReportsPage from "./pages/AdminReportsPage"; // Resuelve la importación correcta de administración
import AdminReservationsPage from "./pages/AdminReservationsPage"; 

// Páginas del Estudiante
import ProfilePage from "./pages/ProfilePage"; 
import ReservationsPage from "./pages/ReservationsPage"; 
import StudentReportsPage from "./pages/StudentReportsPage"; 
import UserHistoryPage from "./pages/UserHistoryPage";

function App() {
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState("dashboard");
  const [loadingSession, setLoadingSession] = useState(true); 
  const [view, setView] = useState<"welcome" | "login" | "register">("welcome");

  const navigateTo = (newView: "welcome" | "login" | "register") => {
    setView(newView);
    window.history.pushState({ view: newView }, "");
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
      } else {
        setView("welcome"); 
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.history.replaceState({ view: "welcome" }, "");

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setPage(parsedUser.roleId === 1 ? "reservations" : "dashboard");
      } catch (e) {
        console.error("Error al parsear el usuario del almacenamiento local", e);
      }
    }

    setLoadingSession(false); 

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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

  const renderContent = () => {
    if (user.roleId === 1) {
      switch (page) {
        case "reservations": 
          return <ReservationsPage />; 
        case "history":
          return <UserHistoryPage />;
        case "penalties": 
          return <StudentReportsPage />;
        case "profile":
          return <ProfilePage user={user} />; 
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