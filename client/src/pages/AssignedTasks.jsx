import { useEffect, useState } from "react";
import { LoadTaskAssigned } from "../api/task";
import { CheckAuth } from "../api/users";
import { EditTask } from "../components/EditTask";

function AssignedTasks() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState();
  const [edit, IsEdit] = useState(false);
  const [idTask, setIdTask] = useState();

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function CheckToken() {
      const token = localStorage.getItem("token");
      const check = await CheckAuth(token);
      setUser(check.data.id);
    }
    CheckToken();
  }, []);

  useEffect(() => {
    async function LoadTask() {
      const res = await LoadTaskAssigned(user);
      setTasks(res.data.tasks);
    }

    if (user) {
      LoadTask();
    }
  }, [user]);

  const handleEdit = (id) => {
    setIdTask(id);
    IsEdit(true);
  };

  return (
    <div className="overflow-x-auto flex flex-col flex-wrap justify-center items-center w-full mt-12 gap-12">
      <table className="min-w-1/2 bg-gray-200 shadow-md p-2 text-center">
        <thead>
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Descripción</th>
            <th className="px-4 py-2 border">Fecha Limite</th>
            <th className="px-4 py-2 border">Estado</th>
            <th className="px-4 py-2 border">Prioridad</th>
            <th className="px-4 py-2 border">Asignado a</th>
            <th className="px-4 py-2 border">Asignado Por</th>
            <th className="px-4 py-2 border">Terminado?</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 && (
            <tr>
              <td colSpan="12" className="text-center py-3">
                <p className="text-center">
                  No Tienes tareas asignadas
                </p>
              </td>
            </tr>
          )}
          {tasks.map((task, index) => (
            <tr key={task.id}>
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{task.name}</td>
              <td className="px-4 py-2 border">{task.description}</td>
              <td className="px-4 py-2 border">{task.deadline}</td>
              <td className="px-4 py-2 border">{task.status}</td>
              <td className="px-4 py-2 border">{task.priority}</td>
              <td className="px-4 py-2 border">{task.assigned_to}</td>
              <td className="px-4 py-2 border">{task.assigned_by}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(task.id)}
                  className="bg-blue-600 px-3 py-2 text-white rounded-md hover:bg-blue-800 transition ease-in-out duration-300"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {edit === true && (
        <EditTask IsOpen={IsEdit} id={idTask} setTasks={setTasks} />
      )}
    </div>
  );
}

export default AssignedTasks;
