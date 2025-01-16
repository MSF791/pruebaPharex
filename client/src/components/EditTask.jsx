import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CheckAuth, GetUsers } from "../api/users";
import { LoadTask, EditTaskForm } from "../api/task";
import { success, load, errorModal, closeModal } from "../hooks/modals";

export function EditTask({ IsOpen, id, setTasks }) {
  const [users, SetUsers] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    async function CheckToken() {
      const token = localStorage.getItem("token");
      const check = await CheckAuth(token);
      setUser(check.data.id);
    }
    CheckToken();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    async function loadUsers() {
      const res = await GetUsers();
      SetUsers(res.data.users);
    }
    loadUsers();
  }, []);

  useEffect(() => {
    async function GetTask() {
      const task = await LoadTask(id);
      setValue('name', task.data.task.name)
      setValue('description', task.data.task.description)
      setValue('deadline', task.data.task.deadline)
      setValue('priority', task.data.task.priority)
      setValue('assigned_to', task.data.task.assigned_to)
      setValue('assigned_by', task.data.task.assigned_by)
      setValue('status', task.data.task.status)
      setValue('id', id)
    }
    if (id) {
      GetTask();
    }
  }, [id]);

  const EditSubmit = handleSubmit(async (data) => {
    try{
        load('editando tarea')
        await EditTaskForm(data);
        updateTaskInList(data);
        closeModal()
        success('Se ha editado la tarea')
        IsOpen(false)
    }catch(error){
        closeModal()
        errorModal('Ha ocurrido un error')
    }
  })

  const updateTaskInList = (updatedTask) => {
    setTasks(prevTasks =>
      prevTasks.map(task => 
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      )
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-lg max-h-[95vh] overflow-y-auto p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Editar Tarea</h2>

        <form autoComplete="off" onSubmit={EditSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre de la Tarea
            </label>
            <input
              type="text"
              id="name"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre de la tarea"
              {...register("name", { required: "Este campo es obligatorio" })}
            />
            {errors.name && (
              <span className="text-red-600 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción
            </label>
            <textarea
              id="description"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción de la tarea"
              {...register("description", {
                required: "Este campo es obligatorio",
              })}
            ></textarea>
            {errors.description && (
              <span className="text-red-600 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha Límite
            </label>
            <input
              type="datetime-local"
              id="deadline"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              {...register("deadline", {
                required: "Este campo es obligatorio",
              })}
            />
            {errors.deadline && (
              <span className="text-red-600 text-sm">
                {errors.deadline.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700"
            >
              Prioridad
            </label>
            <select
              id="priority"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              {...register("priority", {
                required: "Este campo es obligatorio",
              })}
            >
              <option value="1">Baja</option>
              <option value="2">Media</option>
              <option value="3">Alta</option>
            </select>
            {errors.priority && (
              <span className="text-red-600 text-sm">
                {errors.priority.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="assigned_to"
              className="block text-sm font-medium text-gray-700"
            >
              Asignar a
            </label>
            <select
              id="assigned_to"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              {...register("assigned_to")}
            >
              <option value="">Seleccione un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700"
            >
              Estado
            </label>
            <select
              id="status"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              {...register("status", {
                required: "Este campo es obligatorio",
              })}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
            {errors.status && (
              <span className="text-red-600 text-sm">
                {errors.status.message}
              </span>
            )}
          </div>

          <input type="hidden" {...register("assigned_by")} />
          <input type="hidden" {...register("id")} />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition ease-in-out duration-300"
          >
            Editar Tarea
          </button>
          <button
            type="button"
            onClick={() => IsOpen(false)}
            className="w-full mt-4 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition ease-in-out duration-300"
          >
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
}
