import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <main>
      <h1 className="text-3xl font-extrabold font-sans mt-12 text-center">
        Bienvenido!.{" "}
      </h1>
      <br />
      <div className="flex justify-center items-center">
        <Link
          to="/login"
          className="text-xl hover:text-blue-600 transition ease-in-out duration-300"
        >
          ¿Quieres administrar tareas?, haz click aqui
        </Link>
      </div>
    </main>
  );
}
