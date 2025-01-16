import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Navbar } from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import { AuthProvider } from "./hooks/AuthContext";
import { MyTasks } from "./pages/MyTasks";
import AssignedTasks from "./pages/AssignedTasks";
import useNotifications from "./hooks/websocket";
import { CheckAuth } from "./api/users";
import HistoryTasks from "./pages/HistoryTasks";

function App() {
  const [user, setUser] = useState(null);

  // Aquí puedes verificar el token de usuario al cargar la app
  useEffect(() => {
    async function CheckToken() {
      const token = localStorage.getItem("token");
      const check = await CheckAuth(token);
      if (check.data) {
        setUser(check.data.id); // Establecer el ID del usuario
      }
    }
    CheckToken();
  }, []);

  // Usar useNotifications para escuchar las notificaciones globalmente
  useNotifications(user);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/assigned-tasks" element={<AssignedTasks />} />
          <Route path="/history-tasks" element={<HistoryTasks />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
