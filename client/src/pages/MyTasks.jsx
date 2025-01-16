import { useEffect, useState } from "react";
import { AddTask } from "../components/AddTask";
import { DeleteTask, LoadTaskCreated } from "../api/task";
import { CheckAuth } from "../api/users";
import { success, load, errorModal, closeModal, notify } from "../hooks/modals";
import { EditTask } from "../components/EditTask";

export function MyTasks() {
  const [open, IsOpen] = useState(false);
  const [edit, IsEdit] = useState(false);
  const [user, setUser] = useState();
  const [tasks, setTasks] = useState([]);
  const [idTask, setIdTask] = useState();
  useEffect(() => {
    async function CheckToken() {
      const token = localStorage.getItem("token");
      const check = await CheckAuth(token);
      setUser(check.data.id);
    }
    CheckToken();
  }, []);
  useEffect(() => {
    async function LoadTasks() {
      const res = await LoadTaskCreated(user);
      setTasks(res.data.tasks);
    }
    if (user) {
      LoadTasks();
    }
  }, [user]);

  const handleClick = () => {
    IsOpen(true);
  };

  const handleEdit = (id) => {
    setIdTask(id)
    IsEdit(true)
  }
  const handleDelete = async (id) => {
    try{
        load('eliminando...')
        await DeleteTask(id)
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        closeModal()
        success('tarea eliminada con éxito!')
    }catch(error){
        closeModal()
        errorModal('Ha ocurrido un error')
    }
  }
  return (
    <div className="flex flex-col flex-wrap justify-center items-center max-w-full mt-4 gap-12">
      <div>
        <button
          className="py-2 px-3 bg-blue-600 text-white rounded-md"
          onClick={handleClick}
        >
          Agregar Tarea
        </button>
      </div>
      <div className="overflow-x-auto max-w-full">
        <table className="bg-gray-200 shadow-md p-2 text-center">
          <thead>
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Descripción</th>
              <th className="px-4 py-2 border">Fecha Limite</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Prioridad</th>
              <th className="px-4 py-2 border">Asignado a</th>
              <th className="px-4 py-2 border">Eliminar</th>
              <th className="px-4 py-2 border">Editar</th>
            </tr>
          </thead>
          <tbody>
          {tasks.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center py-3">
                  <p className="text-center">
                    No Tienes tareas creadas
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
                <td className="px-4 py-2 border">
                  <button
                    className="p-2 bg-red-600 text-white rounded-md"
                    onClick={() => {
                      const confirmDelete = window.confirm(
                        "¿Estás seguro de eliminar esta tarea?"
                      );
                      if (confirmDelete) {
                        handleDelete(task.id)
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </td>
                <td className="px-4 py-2 border">
                  <button className="p-2 bg-blue-600 text-white rounded-md" onClick={() => handleEdit(task.id)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open === true && <AddTask IsOpen={IsOpen} setTasks={setTasks}/>}
      {edit === true && <EditTask IsOpen={IsEdit} id={idTask} setTasks={setTasks}/>}
    </div>
  );
}
