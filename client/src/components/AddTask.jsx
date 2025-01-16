import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckAuth, GetUsers } from "../api/users";
import { SaveTask } from "../api/task";
import { success, load, errorModal, closeModal } from "../hooks/modals";

export function AddTask({ IsOpen, setTasks }) {
  const [users, SetUsers] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  useEffect(() => {
    async function loadUsers() {
      const res = await GetUsers();
      SetUsers(res.data.users);
    }
    loadUsers();
  }, []);

  useEffect(() => {
    async function CheckToken(){
        const token = localStorage.getItem('token')
        const check = await CheckAuth(token);
        setValue('assigned_by', check.data.id)
    }
    CheckToken()
  }, [])

  const SubmitTask = handleSubmit(async (data) => {
    try{
        load('Creando tarea...')
        const res = await SaveTask(data);
        const newTask = res.data;
        setTasks(prevTasks => [...prevTasks, newTask]);
        closeModal()
        success('Tarea Creado con éxito')
        IsOpen(false)
    }catch(error){
        closeModal()
        errorModal('Ha ocurrido un error')
    }
  })


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Agregar Tarea</h2>

        <form autoComplete="off" onSubmit={SubmitTask}>
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

          <input type="hidden" {...register("assigned_by")} />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition ease-in-out duration-300"
          >
            Guardar Tarea
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
