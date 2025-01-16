import { useForm } from "react-hook-form";
import { LoginUser } from "../api/users";
import { success, load, errorModal, closeModal } from "../hooks/modals";
import { useContext, useState } from "react";
import { Register } from "./Register";
import { AuthContext } from "../hooks/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const [visible, IsVisible] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleClick = () => {
    IsVisible(true)
  }

  const OnSubmit = handleSubmit(async (data) => {
    try{
        load('Iniciando Sesión')
        const res = await LoginUser(data);
        login(res.data);
        closeModal()
        success('Has Iniciado Sesión')
    }catch (error){

        closeModal()
        if(error.response.data.detail === 'Usuario o contraseña incorrectos'){
            errorModal('Usuario o contraseña incorrectos')
        }else{
            errorModal('ha ocurrido un error')
        }
        
    }

  });
  return (
    <div className="w-full h-full mt-[80px] rounded-lg flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-extrabold">Iniciar Sesión</h1>
      <form
        className="flex flex-col justify-center items-center max-w-full sm:w-[300px] md:w-[300px]"
        onSubmit={OnSubmit}
        autoComplete="off"
      >
        <div className="mt-8 w-full">
          <label>Correo Electronico</label>
          <br />
          <input
            type="email"
            className="bg-gray-200 w-full h-[45px] p-2 shadow-black shadow-md focus:outline-none"
            placeholder="Ingresa Tu Email"
            {...register("email", { required: "Este campo es obligatorio" })}
          />
          {errors.email && <span className="font-sans text-red-600">{errors.email.message}</span>}
        </div>
        <div className="mt-10 w-full">
          <label>Contraseña</label>
          <br />
          <input
            type="password"
            className="bg-gray-200 w-full h-[45px] p-2 shadow-black shadow-md focus:outline-none"
            placeholder="Ingresa Tu Contraseña"
            {...register("password",  {required:"Este campo es obligatorio"})}
          />
          {errors.password && <span className="font-sans text-red-600">{errors.password.message}</span>}
        </div>
        <div className="mt-10 flex flex-col justify-center items-center gap-3">
          <button
            type="submit"
            className="bg-blue-600 p-3 text-white rounded-sm hover:bg-blue-800 transition ease-in-out duration-300"
          >
            Iniciar Sesión
          </button>
          <span className="font-sans text-blue-600 hover:text-black cursor-pointer transition ease-in-out duration-300" onClick={handleClick}>¿No tienes cuenta?, crea una aqui</span>
        </div>
      </form>
      {visible == true && (<Register IsVisible={IsVisible} />)}
    </div>
  );
}

export default Login;
