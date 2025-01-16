import { useForm } from "react-hook-form";
import { RegisterUser } from "../api/users";
import { success, load, errorModal, closeModal } from "../hooks/modals";

export function Register({ IsVisible }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const OnSubmit = handleSubmit(async (data) => {
    try{
        load('creando usuario...')
        await RegisterUser(data);
        closeModal()
        success('Usuario creado satisfactoriamente')
    }catch(error){
        closeModal()
        if(error.response.data.detail=='El email digitado ya está en uso.'){
            errorModal('El email digitado ya está en uso.')
        }else{
            errorModal('ha ocurrido un error')
        } 
        
    }
    
  })
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[500px] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Registro de Usuario
        </h2>

        <form autoComplete="off" onSubmit={OnSubmit}>

          <div className="mb-4">
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre
            </label>
            <input
              type="text"
              id="first_name"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu nombre"
              {...register("first_name", {
                required: "Este campo es obligatorio",
              })}
            />
            {errors.first_name && (
              <span className="font-sans text-red-600">
                {errors.first_name.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700"
            >
              Apellido
            </label>
            <input
              type="text"
              id="last_name"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu apellido"
              {...register("last_name", {
                required: "Este campo es obligatorio",
              })}
            />
            {errors.last_name && (
              <span className="font-sans text-red-600">
                {errors.last_name.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="ejemplo@correo.com"
              {...register("email", { required: "Este campo es obligatorio" })}
            />
            {errors.email && (
              <span className="font-sans text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="cellphone"
              className="block text-sm font-medium text-gray-700"
            >
              Teléfono
            </label>
            <input
              type="text"
              id="cellphone"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu teléfono"
              {...register("cellphone", {
                required: "Este campo es obligatorio",
              })}
            />
            {errors.cellphone && (
              <span className="font-sans text-red-600">
                {errors.cellphone.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu contraseña"
              {...register("password", {
                required: "Este campo es obligatorio",
              })}
            />
            {errors.password && (
              <span className="font-sans text-red-600">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition ease-in-out duration-300"
          >
            Registrar
          </button>
          <button onClick={() => IsVisible(false)} className="w-full mt-4">
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
}
