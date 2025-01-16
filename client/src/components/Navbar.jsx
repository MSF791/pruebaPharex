import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../hooks/AuthContext";
import { success } from "../hooks/modals";

export function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    success("se ha cerrado la sesión satisfactoriamente");
  };
  return (
    <header className="w-full h-[80px] bg-blue-700 flex justify-between items-center px-4">
      <ul className="flex justify-between items-center w-full max-w-screen-xl mx-auto text-white">
        {isLoggedIn && (
          <>
            <Link to="/my-tasks" className="hover:text-black transition ease-in-out duration-300 cursor-pointer">
              Crear tareas
            </Link>
            <Link to="/assigned-tasks" className="hover:text-black transition ease-in-out duration-300 cursor-pointer">
              Tareas Asignadas
            </Link>
            <Link to="/history-tasks" className="hover:text-black transition ease-in-out duration-300 cursor-pointer">
              Historial Tareas
            </Link>
          </>
        )}

        <li className="hover:text-black transition ease-in-out duration-300 cursor-pointer">
          {isLoggedIn ? (
            <span onClick={handleLogout}>Cerrar Sesión</span>
          ) : (
            <Link to="/login">Iniciar Sesión</Link>
          )}
        </li>
      </ul>
    </header>
  );
}
